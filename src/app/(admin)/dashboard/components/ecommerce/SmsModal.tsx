import { useState } from "react";

interface SmsModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  clientName?: string;
}

export default function SmsModal({ open, onClose, onSend, clientName }: SmsModalProps) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-content" style={{ maxWidth: 400 }}>
        <button className="dashboard-modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="dashboard-modal-title">Send SMS {clientName && `to ${clientName}`}</h2>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Type your SMS message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="dashboard-modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => { onSend(message); setMessage(""); onClose(); }}
            disabled={!message.trim()}
          >
            Send SMS
          </button>
        </div>
      </div>
    </div>
  );
}