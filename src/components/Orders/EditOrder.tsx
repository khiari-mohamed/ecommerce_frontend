import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateOrder } from "../../services/orders";

interface EditOrderProps {
  order: any;
  toggleModal: (open: boolean) => void;
  onOrderUpdated?: (updatedOrder: any) => void;
}

const STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "on-hold", label: "On Hold" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

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

const EditOrder: React.FC<EditOrderProps> = ({ order, toggleModal, onOrderUpdated }) => {
  const [currentStatus, setCurrentStatus] = useState(order?.etat || order?.status || "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      const updatedOrder = await updateOrder(order._id, { etat: currentStatus });
      toast.success("Order status updated!");
      if (onOrderUpdated) onOrderUpdated(updatedOrder);
      toggleModal(false);
    } catch (err: any) {
      toast.error("Failed to update order status");
    }
  };

  // Order info for display
  const orderId = order?._id || order?.id || "N/A";
  const createdAt = order?.created_at || order?.createdAt || "N/A";
  const rawTotal = order?.prix_ttc || order?.totalTTC || order?.total || "N/A";
  const total =
    rawTotal !== "N/A"
      ? `${Number(rawTotal).toLocaleString("fr-TN")} DT`
      : "N/A";
  const title =
    order?.title ||
    order?.nom ||
    order?.prenom ||
    order?.description ||
    "Order";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <table className="min-w-full bg-white mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Order</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold text-purple-700">
                #{String(orderId).slice(-8)}
              </td>
              <td className="px-4 py-2 text-gray-700">{formatDate(createdAt)}</td>
              <td className="px-4 py-2 text-gray-900">{title}</td>
              <td className="px-4 py-2 font-bold text-purple-700">{total}</td>
              <td className="px-4 py-2">
                <select
                  className="w-full rounded-[10px] border border-gray-3 bg-gray-1 text-dark py-2 px-3 text-custom-sm"
                  name="status"
                  id="status"
                  required
                  value={currentStatus}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="mt-2 w-full rounded-[10px] border border-blue-1 bg-blue-1 text-white py-3 px-5 text-custom-sm bg-blue"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
