import { Client } from "@/types/client";
import { useState, useEffect } from "react";
import "../../styles/dashboard.css";
interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Client>) => void;
  client?: Client | null;
}

export default function ClientModal({ open, onClose, onSave, client }: Props) {
  const [form, setForm] = useState<Partial<Client>>({});

  useEffect(() => {
    setForm(client || {});
  }, [client]);

  if (!open) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <button
          className="dashboard-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="dashboard-modal-title">{client ? "Edit Client" : "Add Client"}</h2>
        <form
          className="dashboard-modal-form"
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <label>
            Name
            <input
              type="text"
              value={form.name || ""}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email || ""}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              value={form.phone_1 || ""}
              onChange={e => setForm(f => ({ ...f, phone_1: e.target.value }))}
            />
          </label>
          <label>
            Adresse
            <input
              type="text"
              value={form.adresse || ""}
              onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
            />
          </label>
          <label>
            Ville
            <input
              type="text"
              value={form.ville || ""}
              onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
            />
          </label>
          <div className="dashboard-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              {client ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}