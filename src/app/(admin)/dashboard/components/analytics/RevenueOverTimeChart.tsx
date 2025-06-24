import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueOverTimeProps {
  data: { date: string; revenue: number }[];
}

const RevenueOverTimeChart: React.FC<RevenueOverTimeProps> = ({ data }) => (
  <div className="analytics-chart-container">
    <h2 className="text-lg font-bold mb-4 text-purple-700">Évolution du chiffre d'affaires</h2>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ede9fe" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis
          width={150}  // Increased width to fit full currency label
          tickFormatter={v => v.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={v => `${v.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`} />
        <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#colorRev)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueOverTimeChart;