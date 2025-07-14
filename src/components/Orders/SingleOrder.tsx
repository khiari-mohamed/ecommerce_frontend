import React from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";

interface SingleOrderProps {
  orderItem: any;
  asCard?: boolean;
  smallView?: boolean;
  onShowDetails?: () => void;
  onShowEdit?: () => void;
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

const SingleOrder: React.FC<SingleOrderProps> = ({
  orderItem,
  asCard,
  onShowDetails,
  onShowEdit,
}) => {
  const orderId = orderItem?._id || orderItem?.id || "N/A";
  const createdAt = orderItem?.created_at || orderItem?.createdAt || "N/A";
  const status = orderItem?.etat || orderItem?.status || "N/A";
  const rawTotal = orderItem?.prix_ttc || orderItem?.totalTTC || orderItem?.total || "N/A";
  const title =
    orderItem?.title ||
    orderItem?.nom ||
    orderItem?.prenom ||
    orderItem?.description ||
    "Order";
  const total =
    rawTotal !== "N/A"
      ? `${Number(rawTotal).toLocaleString("fr-TN")} DT`
      : "N/A";

  let statusClass = "text-gray-500 bg-gray-100";
  if (status === "livrée" || status === "delivered") {
    statusClass = "text-green-600 bg-green-100";
  } else if (status === "annulée" || status === "cancelled" || status === "on-hold") {
    statusClass = "text-red-600 bg-red-100";
  } else if (status === "en cours" || status === "processing" || status === "nouvelle_commande") {
    statusClass = "text-yellow-600 bg-yellow-100";
  }

  // Render as table row or card
  return asCard ? (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow flex flex-col items-center text-center">
      <div className="font-semibold text-purple-700 mb-2">
        #{String(orderId).slice(-8)}
      </div>
      <div className="text-gray-700 mb-2">{formatDate(createdAt)}</div>
      <div className="mb-2">
        <span className={`text-xs font-bold py-1 px-3 rounded-full ${statusClass}`}>
          {formatStatus(status)}
        </span>
      </div>
      <div className="text-gray-900 mb-2">{title}</div>
      <div className="font-bold text-purple-700 mb-2">{total}</div>
      <OrderActions
  toggleDetails={onShowDetails ?? (() => {})}
  toggleEdit={onShowEdit ?? (() => {})}
/>
    </div>
  ) : (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-semibold text-purple-700">
        #{String(orderId).slice(-8)}
      </td>
      <td className="px-6 py-4 text-gray-700">{formatDate(createdAt)}</td>
      <td className="px-6 py-4">
        <span className={`text-xs font-bold py-1 px-3 rounded-full ${statusClass}`}>
          {formatStatus(status)}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-900">{title}</td>
      <td className="px-6 py-4 font-bold text-purple-700">{total}</td>
      <td className="px-6 py-4">
        <OrderActions
          toggleDetails={onShowDetails ?? (() => {})}
          toggleEdit={onShowEdit ?? (() => {})}
        />
      </td>
    </tr>
  );
};

export default SingleOrder;