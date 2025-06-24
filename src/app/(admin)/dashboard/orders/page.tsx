"use client";
import Orders from "@/components/Orders";
import EditOrder from "@/components/Orders/EditOrder";
import OrderActions from "@/components/Orders/OrderActions";
import OrderDetails from "@/components/Orders/OrderDetails";
import OrderModal from "@/components/Orders/OrderModal";
import SingleOrder from "@/components/Orders/SingleOrder";
import "../styles/dashboard.css";
import React, { useState } from "react";

// Minimal mock order for demo purposes
const mockOrder = {
  _id: "order1234567890",
  created_at: "2024-06-01 14:30:00",
  etat: "nouvelle_commande",
  prix_ttc: 123.45,
  title: "Commande test",
  nom: "Test",
  prenom: "User",
  description: "Commande de test",
};

export default function AdminOrdersPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Modal close handler
  const handleCloseModal = () => {
    setShowDetails(false);
    setShowEdit(false);
  };

  return (
    <div className="admin-orders-bg">
      <div className="admin-orders-container">
        <h1 className="admin-orders-heading">Admin Orders - All Components</h1>
        <div className="admin-orders-card space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">Orders (Full List)</h2>
            <Orders />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">SingleOrder (Desktop)</h2>
            {/* Use asCard for non-table context */}
            <SingleOrder orderItem={mockOrder} asCard />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">SingleOrder (Mobile)</h2>
            {/* Use asCard for non-table context */}
            <SingleOrder orderItem={mockOrder} asCard />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">OrderDetails</h2>
            <OrderDetails orderItem={mockOrder} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">EditOrder</h2>
            <EditOrder order={mockOrder} toggleModal={() => {}} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">OrderActions</h2>
            <OrderActions
              toggleDetails={() => {
                setShowDetails(true);
                setShowEdit(false);
              }}
              toggleEdit={() => {
                setShowEdit(true);
                setShowDetails(false);
              }}
            />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">OrderModal</h2>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
              onClick={() => {
                setShowDetails(true);
                setShowEdit(false);
              }}
            >
              Show Order Modal
            </button>
            <button
              className="ml-2 px-4 py-2 bg-purple-400 text-white rounded shadow hover:bg-purple-500 transition"
              onClick={() => {
                setShowEdit(true);
                setShowDetails(false);
              }}
            >
              Show Edit Modal
            </button>
            <OrderModal
              showDetails={showDetails}
              showEdit={showEdit}
              toggleModal={handleCloseModal}
              order={mockOrder}
            />
          </section>
        </div>
      </div>
    </div>
  );
}