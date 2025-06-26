import React, { useState } from "react";
import { Aroma } from "@/types/aroma";
import { createFlavor, updateFlavor } from "../../utils/fetchflavors";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface FlavorFormModalProps {
  flavor?: Aroma | null;
  onClose: () => void;
}

const FlavorFormModal: React.FC<FlavorFormModalProps> = ({ flavor, onClose }) => {
  const [form, setForm] = useState<Partial<Aroma>>(flavor || { id: "", designation_fr: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (flavor) {
      await updateFlavor(flavor._id, form);
    } else {
      await createFlavor(form);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={flavor ? "Edit Flavor" : "Add Flavor"} size="md">
      <form className="dashboard-modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="dashboard-label">Custom ID</label>
          <input
            className="dashboard-input"
            type="text"
            value={form.id || ""}
            onChange={e => setForm({ ...form, id: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="dashboard-label">Name</label>
          <input
            className="dashboard-input"
            type="text"
            value={form.designation_fr}
            onChange={e => setForm({ ...form, designation_fr: e.target.value })}
            required
          />
        </div>
        {flavor && (
          <>
            <div className="form-group">
              <label className="dashboard-label">Created At</label>
              <input
                className="dashboard-input"
                type="text"
                value={flavor.created_at}
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="dashboard-label">Updated At</label>
              <input
                className="dashboard-input"
                type="text"
                value={flavor.updated_at}
                readOnly
              />
            </div>
          </>
        )}
        <div className="dashboard-modal-actions">
          <Button type="submit" variant="primary" loading={loading}>
            {flavor ? "Save" : "Add"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default FlavorFormModal;