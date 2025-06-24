
import React from "react";

interface PromoCodeStatsProps {
  data: { code: string; usageCount: number; totalDiscount: number }[];
}

const PromoCodeStatsTable: React.FC<PromoCodeStatsProps> = ({ data }) => {
  // Debug: See what data is being passed
  if (process.env.NODE_ENV !== "production") {
    console.log("PromoCodeStatsTable data:", data);
  }

  const isEmpty =
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every((row) => !row.usageCount && !row.totalDiscount);

  return (
    <div className="analytics-chart-container">
      <h2 className="text-lg font-bold mb-4 text-purple-700">Statistiques des Codes Promo</h2>
      <div className="overflow-x-auto">
        {isEmpty ? (
          <div className="text-center text-gray-500 py-12">
            <span>Aucune donnée de code promo disponible.</span>
          </div>
        ) : (
          <table className="analytics-table min-w-full text-sm">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-right">Utilisations</th>
                <th className="px-4 py-2 text-right">Remise Totale</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.code} className="border-b hover:bg-purple-50">
                  <td className="px-4 py-2">{row.code}</td>
                  <td className="px-4 py-2 text-right">{row.usageCount}</td>
                  <td className="px-4 py-2 text-right">
                    {row.totalDiscount.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PromoCodeStatsTable;
