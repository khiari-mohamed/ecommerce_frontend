
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface YearOverYearProps {
  data: { year: string; revenue: number }[];
}

const YearOverYearChart: React.FC<YearOverYearProps> = ({ data }) => {
  // Debug: See what data is being passed
  // Remove or comment out in production
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("YearOverYearChart data:", data);
  }

  const isEmpty =
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every((d) => !d.revenue || d.revenue === 0);

  return (
    <div className="analytics-chart-container">
      <h2 className="text-lg font-bold mb-4 text-purple-700">
        Comparaison Année sur Année
      </h2>
      {isEmpty ? (
        <div className="text-center text-gray-500 py-12">
          <span>Aucune donnée disponible pour cette période.</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(v) =>
                v.toLocaleString("fr-TN", {
                  style: "currency",
                  currency: "TND",
                  maximumFractionDigits: 0,
                })
              }
            />
            <Tooltip
              formatter={(v: number) =>
                v.toLocaleString("fr-TN", {
                  style: "currency",
                  currency: "TND",
                  maximumFractionDigits: 0,
                })
              }
            />
            <Bar dataKey="revenue" fill="#7c3aed">
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(v: number) =>
                  v.toLocaleString("fr-TN", {
                    style: "currency",
                    currency: "TND",
                    maximumFractionDigits: 0,
                  })
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default YearOverYearChart;
