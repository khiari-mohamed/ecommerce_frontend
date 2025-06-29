import React, { useEffect, useState } from "react";
import DonutChartOne from "./DonutChartOne";

export default function OrdersByCategoryDonut() {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/analytics/orders-by-category")
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement des catégories.");
        return res.json();
      })
      .then(result => {
        setLabels(Array.isArray(result.labels) ? result.labels : []);
        setData(Array.isArray(result.data) ? result.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Erreur lors du chargement des catégories.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-12">Chargement des catégories...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12 font-bold">{error}</div>;
  }

  return (
    <DonutChartOne
      labels={labels}
      data={data}
      title="Orders by Category"
    />
  );
}