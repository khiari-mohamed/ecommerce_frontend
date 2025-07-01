import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import OrderModal from "./OrderModal";

interface SingleOrderProps {
  orderItem: any;
  onShowDetails: () => void;
  onShowEdit: () => void;
  // other props if any
}

interface OrdersProps {
  orders: any[];
}

const Orders: React.FC<OrdersProps> = ({ orders = [] }) => {
  // Modal state
  const [modalOrder, setModalOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Handlers to open modal from SingleOrder
  const handleShowDetails = (order: any) => {
    setModalOrder(order);
    setShowDetails(true);
    setShowEdit(false);
  };
  const handleShowEdit = (order: any) => {
    setModalOrder(order);
    setShowEdit(true);
    setShowDetails(false);
  };
  const handleCloseModal = () => {
    setShowDetails(false);
    setShowEdit(false);
    setModalOrder(null);
  };

  return (
    <div className="w-full overflow-x-auto force-orders-table">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder
                key={orderItem._id || key}
                orderItem={orderItem}
                onShowDetails={() => handleShowDetails(orderItem)}
                onShowEdit={() => handleShowEdit(orderItem)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8">You dont have any orders!</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Render modal outside the table */}
      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={handleCloseModal}
        order={modalOrder}
      />
    </div>
  );
};

export default Orders;