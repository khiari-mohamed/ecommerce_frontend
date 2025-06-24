"use client";
import { useEffect, useState } from "react";
import { fetchClients, sendBulkSmsToClients, sendSmsToClient, updateClient } from "@/services/clients";
import ClientTable from "../components/ecommerce/ClientTable";
import ClientModal from "../components/ecommerce/ClientModal";
import SmsModal from "../components/ecommerce/SmsModal";
import { exportClientsToCsv } from "../utils/exportCsv";
import { Client } from "@/types/client";
import "../styles/dashboard.css";
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsClient, setSmsClient] = useState<Client | null>(null);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  useEffect(() => {
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);

  const handleSendSms = (client: Client) => {
    setSmsClient(client);
    setSmsModalOpen(true);
  };

  const handleSmsSend = async (message: string) => {
    if (smsClient) {
      await sendSmsToClient(smsClient.phone_1, message);
      alert("SMS sent!");
    } else if (selectedClientIds.length > 0) {
      const selectedClients = clients.filter((c) =>
        selectedClientIds.includes(c._id)
      );
      const phones = selectedClients.map((c) => c.phone_1).filter(Boolean);
      await sendBulkSmsToClients(phones, message);
      alert("Bulk SMS sent!");
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const handleSave = async (data: Partial<Client>) => {
    if (editingClient) {
      await updateClient(editingClient._id, data);
    } else {
      // Implement add client API call here
    }
    setModalOpen(false);
    setLoading(true);
    fetchClients().then(setClients).finally(() => setLoading(false));
  };

  const handleToggleSubscribe = async (client: Client) => {
    await updateClient(client._id, { subscriber: !client.subscriber });
    fetchClients().then(setClients);
  };

  const handleSelectClient = (id: string, checked: boolean) => {
    setSelectedClientIds((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedClientIds(checked ? clients.map((c) => c._id) : []);
  };

  return (
    <div className="dashboardContent">
      <h1 className="text-2xl font-bold mb-4">
        Clients{" "}
        <span className="text-base font-normal text-gray-500">
          ({clients.length})
        </span>
      </h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleAdd}
      >
        Add Client
      </button>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded ml-2"
        disabled={selectedClientIds.length === 0}
        onClick={() => {
          setSmsClient(null); // null means bulk
          setSmsModalOpen(true);
        }}
      >
        Send SMS to Selected
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ClientTable
          clients={clients}
          onEdit={handleEdit}
          onSendSms={handleSendSms}
          onExport={() => exportClientsToCsv(clients)}
          onToggleSubscribe={handleToggleSubscribe}
          selectedClientIds={selectedClientIds}
          onSelectClient={handleSelectClient}
          onSelectAll={handleSelectAll}
        />
      )}
      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        client={editingClient}
      />
      <SmsModal
        open={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        onSend={handleSmsSend}
        clientName={smsClient?.name || (selectedClientIds.length > 0 ? "Selected Clients" : undefined)}
      />
    </div>
  );
}