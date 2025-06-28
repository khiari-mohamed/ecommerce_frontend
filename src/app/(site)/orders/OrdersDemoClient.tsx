"use client";
import Orders from "@/components/Orders";
import EditOrder from "@/components/Orders/EditOrder";
import OrderActions from "@/components/Orders/OrderActions";
import OrderDetails from "@/components/Orders/OrderDetails";
import OrderModal from "@/components/Orders/OrderModal";
import SingleOrder from "@/components/Orders/SingleOrder";
import React, { useState } from "react";

const mockOrder = {
  _id: "order1234567890",
  created_at: "2024-06-01",
  etat: "en cours",
  prix_ttc: 123.45,
  title: "Commande test",
  nom: "Test",
  prenom: "User",
  description: "Commande de test",
};


export default function OrdersDemoClient() {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 space-y-10">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center drop-shadow">
          Demo: Orders Components
        </h1>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            Orders (Full List)
          </h2>
          <Orders orders={[]} />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            SingleOrder (Desktop)
          </h2>
          <SingleOrder orderItem={mockOrder} smallView={false} />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            SingleOrder (Mobile)
          </h2>
          <SingleOrder orderItem={mockOrder} smallView={true} />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            OrderDetails
          </h2>
          <OrderDetails orderItem={mockOrder} />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            EditOrder
          </h2>
          <EditOrder order={mockOrder} toggleModal={() => {}} />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            OrderActions
          </h2>
          <OrderActions
            toggleDetails={() => setShowDetails((v) => !v)}
            toggleEdit={() => setShowEdit((v) => !v)}
          />
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700">
            OrderModal
          </h2>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
            onClick={() => setShowDetails(true)}
          >
            Show Order Modal
          </button>
          <OrderModal
            showDetails={showDetails}
            showEdit={showEdit}
            toggleModal={() => {
              setShowDetails(false);
              setShowEdit(false);
            }}
            order={mockOrder}
          />
        </section>
      </div>
    </div>
  );
}
