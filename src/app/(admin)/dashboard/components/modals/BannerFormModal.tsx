
import React, { useState, useEffect } from "react";
import { Banner } from "@/types/banner";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import "../../styles/dashboard.css";

interface BannerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (banner: Banner) => void;
  initialData?: Banner | null;
}

const BannerFormModal: React.FC<BannerFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setImageUrl(initialData.imageUrl);
      setLinkUrl(initialData.linkUrl);
      setIsActive(initialData.isActive);
    } else {
      setTitle("");
      setImageUrl("");
      setLinkUrl("");
      setIsActive(true);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(initialData?._id ? { _id: initialData._id } : {}),
      title,
      imageUrl,
      linkUrl,
      isActive,
    });
  };

  // Only render the modal if open, to avoid unnecessary DOM nodes
  if (!open) return null;

  return (
    <div className="banner-modal dashboard-modal--fullscreen">
      <Modal open={open} onClose={onClose} title={initialData ? "Modifier le banner" : "Ajouter un banner"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Titre
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Image URL
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </label>
          <label>
            Lien
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Actif
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannerFormModal;
