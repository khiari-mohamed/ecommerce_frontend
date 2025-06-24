import React from "react";

interface OrderDetailsProps {
  orderItem: any;
}

function formatStatus(status: string) {
  if (!status) return "";
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  return date.toLocaleDateString("fr-TN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderItem }) => {
  const orderId = orderItem?._id || orderItem?.id || "N/A";
  const createdAt = orderItem?.created_at || orderItem?.createdAt || "N/A";
  const status = orderItem?.etat || orderItem?.status || "N/A";
  const rawTotal = orderItem?.prix_ttc || orderItem?.totalTTC || orderItem?.total || "N/A";
  const total =
    rawTotal !== "N/A"
      ? `${Number(rawTotal).toLocaleString("fr-TN")} DT`
      : "N/A";
  const title =
    orderItem?.title ||
    orderItem?.nom ||
    orderItem?.prenom ||
    orderItem?.description ||
    "Order";
  const shippingAddress =
    orderItem?.adresse1 ||
    orderItem?.address ||
    orderItem?.livraison_adresse1 ||
    orderItem?.client?.address ||
    "No shipping address provided";

  let statusClass = "text-gray-500 bg-gray-100";
  if (status === "livrée" || status === "delivered") {
    statusClass = "text-green-600 bg-green-100";
  } else if (status === "annulée" || status === "cancelled" || status === "on-hold") {
    statusClass = "text-red-600 bg-red-100";
  } else if (status === "en cours" || status === "processing" || status === "nouvelle_commande") {
    statusClass = "text-yellow-600 bg-yellow-100";
  }

  return (
    <div className="w-full">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Order</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 font-semibold text-purple-700">
              #{String(orderId).slice(-8)}
            </td>
            <td className="px-4 py-2 text-gray-700">{formatDate(createdAt)}</td>
            <td className="px-4 py-2">
              <span className={`text-xs font-bold py-1 px-3 rounded-full ${statusClass}`}>
                {formatStatus(status)}
              </span>
            </td>
            <td className="px-4 py-2 text-gray-900">{title}</td>
            <td className="px-4 py-2 font-bold text-purple-700">{total}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 px-4">
        <p className="font-bold">Shipping Address:</p>
        <p>{shippingAddress}</p>
      </div>
    </div>
  );
};

export default OrderDetails;