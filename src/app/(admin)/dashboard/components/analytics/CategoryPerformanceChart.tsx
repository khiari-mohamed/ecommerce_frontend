import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface CategoryPerformanceProps {
  data: { name: string; totalSales: number }[];
}

const CategoryPerformanceChart: React.FC<CategoryPerformanceProps> = ({ data }) => {
  const isEmpty = !data || !Array.isArray(data) || data.length === 0 || data.every(d => !d.totalSales);

  return (
    <div className="analytics-chart-container">
      <h2 className="text-lg font-bold mb-4 text-purple-700">Performance par Catégorie</h2>
      {isEmpty ? (
        <div className="text-center text-gray-500 py-12">
          <span>Aucune donnée de catégorie disponible.</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={v => v.toLocaleString("fr-TN", { style: "currency", currency: "TND" })} />
            <Tooltip formatter={v => `${v.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`} />
            <Bar dataKey="totalSales" fill="#7c3aed">
              <LabelList dataKey="totalSales" position="top" formatter={v => v.toLocaleString("fr-TN", { style: "currency", currency: "TND" })} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryPerformanceChart;