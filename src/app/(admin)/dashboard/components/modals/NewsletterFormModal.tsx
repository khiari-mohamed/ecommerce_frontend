import React, { useState } from "react";
import  Modal  from "../ui/Modal";
import  Button  from "../ui/Button";
import { addSubscriber } from "../../utils/fetchNewsletterSubscribers";
import "../../styles/dashboard.css";
interface NewsletterFormModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const NewsletterFormModal: React.FC<NewsletterFormModalProps> = ({
  open,
  onClose,
  onAdded,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await addSubscriber(email);
      setStatus("success");
      setMessage("Abonné ajouté avec succès !");
      setEmail("");
      onAdded();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Erreur lors de l'ajout.");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un abonné">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email de l'abonné"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        {message && (
          <div
            className={`text-sm text-center ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : ""
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button" disabled={status === "loading"}>
            Annuler
          </Button>
          <Button type="submit" disabled={status === "loading" || !email}>
            {status === "loading" ? "Ajout..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewsletterFormModal;