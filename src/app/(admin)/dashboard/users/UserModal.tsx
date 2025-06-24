import React, { useState, useEffect } from "react";

export default function UserModal({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    id: "",
    role_id: "",
    name: "",
    email: "",
    avatar: "",
    email_verified_at: "",
    password: "",
    remember_token: "",
    settings: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id || "",
        role_id: user.role_id || "",
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        email_verified_at: user.email_verified_at || "",
        password: "",
        remember_token: user.remember_token || "",
        settings: user.settings || "",
        phone: user.phone || "",
      });
    } else {
      setForm({
        id: "",
        role_id: "",
        name: "",
        email: "",
        avatar: "",
        email_verified_at: "",
        password: "",
        remember_token: "",
        settings: "",
        phone: "",
      });
    }
  }, [user, open]);

  if (!open) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content">
        <form
          className="dashboard-modal-form"
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <input
            placeholder="ID"
            value={form.id || ""}
            onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
          />
          <input
            placeholder="Role ID"
            value={form.role_id || ""}
            onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
          />
          <input
            placeholder="Name"
            value={form.name || ""}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            placeholder="Email"
            value={form.email || ""}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            placeholder="Avatar"
            value={form.avatar || ""}
            onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
          />
          <input
            placeholder="Email Verified At"
            value={form.email_verified_at || ""}
            onChange={e => setForm(f => ({ ...f, email_verified_at: e.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password || ""}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required={!user}
          />
          <input
            placeholder="Remember Token"
            value={form.remember_token || ""}
            onChange={e => setForm(f => ({ ...f, remember_token: e.target.value }))}
          />
          <input
            placeholder="Settings"
            value={form.settings || ""}
            onChange={e => setForm(f => ({ ...f, settings: e.target.value }))}
          />
          <input
            placeholder="Phone"
            value={form.phone || ""}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
          <div className="dashboard-modal-actions">
            <button type="submit">{user ? "Save" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}