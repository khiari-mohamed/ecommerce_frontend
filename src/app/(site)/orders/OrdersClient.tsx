"use client";
import Orders from "@/components/Orders";
import { Order } from "@/types/order";
import React from "react";

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center drop-shadow">
          Mes Commandes
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Orders orders={initialOrders} />
        </div>
      </div>
    </div>
  );
}
