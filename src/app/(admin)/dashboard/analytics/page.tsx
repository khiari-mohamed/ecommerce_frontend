"use client";
import React, { useEffect, useState } from "react";
import {
  fetchRevenueOverTime,
  fetchYearOverYear,
  fetchCategoryPerformance,
  fetchPromoCodeStats,
  fetchSalesByCountry,
} from "../utils/fetchAnalytics";
import dynamic from "next/dynamic";
const WorldMapChart = dynamic(() => import("../components/charts/WorldMapChart"), { ssr: false });
import RevenueOverTimeChart from "../components/analytics/RevenueOverTimeChart";
import YearOverYearChart from "../components/analytics/YearOverYearChart";
import CategoryPerformanceChart from "../components/analytics/CategoryPerformanceChart";
import PromoCodeStatsTable from "../components/analytics/PromoCodeStatsTable";
import "../styles/dashboard.css"; // <-- Import your custom CSS

const AnalyticsPage: React.FC = () => {
  const [revenueOverTime, setRevenueOverTime] = useState<{ date: string; revenue: number }[]>([]);
  const [yearOverYear, setYearOverYear] = useState<{ year: string; revenue: number }[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<{ name: string; totalSales: number }[]>([]);
  const [promoCodeStats, setPromoCodeStats] = useState<{ code: string; usageCount: number; totalDiscount: number }[]>([]);
  const [salesByCountry, setSalesByCountry] = useState<{ country: string; sales: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRevenueOverTime(),
      fetchYearOverYear(),
      fetchCategoryPerformance(),
      fetchPromoCodeStats(),
      fetchSalesByCountry(),
    ])
      .then(
        ([
          revenueOverTimeData,
          yearOverYearData,
          categoryPerformanceData,
          promoCodeStatsData,
          salesByCountryData,
        ]) => {
          const mappedRevenue = (revenueOverTimeData || []).map((d: any) => ({
            date: d.label,
            revenue: d.totalRevenue,
          }));
          console.log("RevenueOverTime API raw:", revenueOverTimeData);
          console.log("RevenueOverTime mapped:", mappedRevenue);
          setRevenueOverTime(mappedRevenue);
          if (yearOverYearData?.currentYear && yearOverYearData?.previousYear) {
          setYearOverYear([
          { year: `${yearOverYearData.previousYear.year}`, revenue: yearOverYearData.previousYear.total },
          { year: `${yearOverYearData.currentYear.year}`, revenue: yearOverYearData.currentYear.total },
          ]);
          } else if (Array.isArray(yearOverYearData?.data)) {
          setYearOverYear(yearOverYearData.data);
          } else {
          setYearOverYear([]);
          }
          setCategoryPerformance(
  (categoryPerformanceData?.data || categoryPerformanceData || []).map((d: any) => ({
    name: d.categoryName || d.name || d.category || d._id || "",
    totalSales: d.totalSold || d.totalSales || d.count || 0,
  }))
);
          setPromoCodeStats(
            (promoCodeStatsData?.data || promoCodeStatsData || []).map((d: any) => ({
              code: d.code || d._id || "",
              usageCount: d.usageCount || d.count || 0,
              totalDiscount: d.totalDiscount || d.discount || 0,
            }))
          );
          setSalesByCountry(
            (salesByCountryData?.data || salesByCountryData || []).map((d: any) => ({
              country: d.country || "Inconnu",
              sales: d.sales || 0,
              orders: d.orders || 0,
            }))
          );
          setLoading(false);
        }
      )
      .catch((err) => {
        setError(err?.message || "Erreur lors du chargement des statistiques.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <svg className="animate-spin h-10 w-10 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="4" />
          <path className="opacity-75" fill="#7c3aed" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-lg text-purple-700 font-bold">Chargement des statistiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <span className="text-lg text-red-700 font-bold mb-4">{error}</span>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-main-content min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-10 px-4">
      <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center tracking-tight">Tableau de Bord Analytique</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="analytics-chart-container">
          <RevenueOverTimeChart data={revenueOverTime} />
          {revenueOverTime.length === 0 && (
            <pre style={{ color: "red", fontSize: 12 }}>
              {JSON.stringify(revenueOverTime, null, 2)}
            </pre>
          )}
        </div>
        <div className="analytics-chart-container">
          <YearOverYearChart data={yearOverYear} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="analytics-chart-container">
          <CategoryPerformanceChart data={categoryPerformance} />
        </div>
        <div className="analytics-chart-container">
          <PromoCodeStatsTable data={promoCodeStats} />
        </div>
      </div>
      <div className="analytics-chart-container mb-10">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Carte du Monde des Ventes</h2>
        <WorldMapChart data={salesByCountry} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
