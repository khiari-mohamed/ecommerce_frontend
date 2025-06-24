"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import PaymeeTransactionDetailModal from "@/app/(admin)/dashboard/components/ecommerce/PaymeeTransactionDetailModal";
import "../../styles/dashboard.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Transaction {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

const PaymeeTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await axios.get(`${API_BASE}/admin/payments/paymee/transactions`, { params });
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [status, search, from, to, page, limit]);

  const handleExport = async () => {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (from) params.from = from;
      if (to) params.to = to;
      const url = `${API_BASE}/admin/payments/paymee/transactions/export?${new URLSearchParams(params).toString()}`;
      window.open(url, "_blank");
      toast.success("Export started!");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="paymee-dashboard-container">
      <h1 className="paymee-dashboard-title">Paymee Transactions</h1>
      <div className="paymee-filters-row">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="paymee-filter-select"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search Order ID or Token"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="paymee-filter-input"
        />
        <input
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="paymee-filter-date"
        />
        <input
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="paymee-filter-date"
        />
        <button
          onClick={handleExport}
          className="paymee-export-btn"
        >
          Export CSV
        </button>
      </div>
      <div className="paymee-table-container">
        <table className="paymee-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Token</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">No transactions found.</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr
                  key={tx._id}
                  className="paymee-table-row"
                  onClick={() => setSelectedTransaction(tx)}
                  title="Click for details"
                >
                  <td>{tx.orderId}</td>
                  <td>{tx.amount} TND</td>
                  <td>
                    <span className={
                      tx.status === "paid"
                        ? "paymee-status-paid"
                        : tx.status === "failed"
                        ? "paymee-status-failed"
                        : "paymee-status-pending"
                    }>
                      {tx.status}
                    </span>
                  </td>
                  <td>{tx.paymentToken || "-"}</td>
                  <td>{tx.createdAt ? format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm") : "-"}</td>
                  <td>{tx.updatedAt ? format(new Date(tx.updatedAt), "yyyy-MM-dd HH:mm") : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="paymee-pagination">
        <span>
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
        </span>
        <div>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="paymee-pagination-btn"
          >
            Prev
          </button>
          <span style={{ margin: "0 8px" }}>Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= total}
            className="paymee-pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
      {/* Detail Modal */}
      {selectedTransaction && (
        <PaymeeTransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default PaymeeTransactionsPage;