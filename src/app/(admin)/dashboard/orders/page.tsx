"use client";

import Orders from "@/components/Orders";
import { useEffect, useState } from "react";
import { fetchOrders } from "@/services/orders";
import "../styles/dashboard.css";

interface Order {
  // define the properties you use, e.g.:
  id?: string;
  _id?: string;
  // ...other properties
}
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchOrders({ type: "all" })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-orders-bg">
      <div className="admin-orders-container">
        <h1 className="admin-orders-heading">Orders</h1>
        <div className="admin-orders-card">
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : (
            <Orders orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}