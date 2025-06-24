import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
const GEOJSON_URL = "/world-countries.geo.json";

interface CountrySales {
  country: string | null;
  sales: number;
  orders: number;
}

interface WorldMapChartProps {
  data: CountrySales[];
}

function getCountrySales(countryName: string, data: CountrySales[]) {
  const found = data.find(
    (d) =>
      d.country &&
      d.country.trim().toLowerCase() === countryName.trim().toLowerCase()
  );
  return found ? found.sales : 0;
}

function getCountryOrders(countryName: string, data: CountrySales[]) {
  const found = data.find(
    (d) =>
      d.country &&
      d.country.trim().toLowerCase() === countryName.trim().toLowerCase()
  );
  return found ? found.orders : 0;
}

function getColor(sales: number, maxSales: number) {
  if (sales === 0) return "#f3f4f6";
  const percent = Math.min(sales / maxSales, 1);
  const interpolate = (a: number, b: number) => Math.round(a + (b - a) * percent);
  const from = [237, 233, 254]; // #ede9fe
  const to = [124, 58, 237];   // #7c3aed
  const rgb = from.map((f, i) => interpolate(f, to[i]));
  return `rgb(${rgb.join(",")})`;
}

const WorldMapChart: React.FC<WorldMapChartProps> = ({ data }) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: string;
    sales: number;
    orders: number;
  } | null>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load GeoJSON:", err);
      });
  }, []);

  const maxSales = Math.max(1, ...data.map((d) => d.sales));

  // Custom handler to highlight country on hover
  function highlightFeature(e: any, countryName: string) {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: "#a78bfa",
      fillOpacity: 0.95,
    });
    setHoveredCountry(countryName);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e: any) {
    const layer = e.target;
    layer.setStyle({
      weight: 1,
      color: "#e5e7eb",
      fillOpacity: 0.85,
    });
    setHoveredCountry(null);
  }

  function onEachFeature(feature: Feature, layer: any) {
    const countryName =
      feature?.properties && "name" in feature.properties
        ? (feature.properties.name as string)
        : "";
    const sales = getCountrySales(countryName, data);
    const orders = getCountryOrders(countryName, data);

    layer.on({
      mouseover: (e: any) => {
        highlightFeature(e, countryName);
        // Show tooltip at mouse position
        const { containerPoint } = e.originalEvent;
        setTooltip({
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
          country: countryName,
          sales,
          orders,
        });
      },
      mouseout: (e: any) => {
        resetHighlight(e);
        setTooltip(null);
      },
      mousemove: (e: any) => {
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY,
              }
            : null
        );
      },
    });

    layer.bindTooltip(
      `<div style="font-weight:bold">${countryName}</div>
      <div>Ventes: ${sales.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</div>
      <div>Commandes: ${orders}</div>`,
      { sticky: true }
    );
  }

  if (!geoData) {
    return (
      <div className="text-center text-gray-500 py-12">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="wmc-root">
      <div className="wmc-map-container">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ width: "100%", height: 400, borderRadius: 12, overflow: "hidden" }}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />
          <GeoJSON
            data={geoData}
            style={(feature) => {
              const countryName =
                feature?.properties && "name" in feature.properties
                  ? (feature.properties.name as string)
                  : "";
              const sales = getCountrySales(countryName, data);
              return {
                fillColor:
                  hoveredCountry === countryName
                    ? "#a78bfa"
                    : getColor(sales, maxSales),
                weight: 1,
                color: "#e5e7eb",
                fillOpacity: 0.85,
                cursor: "pointer",
                transition: "fill 0.2s",
              };
            }}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
        {tooltip && (
          <div
            className="wmc-tooltip"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 30,
              position: "fixed",
              zIndex: 9999,
            }}
          >
            <div className="wmc-tooltip-country">{tooltip.country}</div>
            <div>
              <span className="wmc-tooltip-sales">
                {tooltip.sales.toLocaleString("fr-TN", {
                  style: "currency",
                  currency: "TND",
                })}
              </span>
              <span className="wmc-tooltip-orders">
                ({tooltip.orders} commandes)
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="wmc-legend">
        <span className="wmc-legend-box wmc-legend-low"></span>
        <span className="wmc-legend-label">Faible ventes</span>
        <span className="wmc-legend-gradient"></span>
        <span className="wmc-legend-label">Forte ventes</span>
        <span className="wmc-legend-box wmc-legend-high"></span>
      </div>
    </div>
  );
};

export default WorldMapChart;