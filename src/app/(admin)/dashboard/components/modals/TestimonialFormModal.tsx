import React, { useState } from "react";
import  Modal  from "../ui/Modal";
import  Button  from "../ui/Button";
import { addTestimonial } from "../../utils/testimonials";
import "../../styles/dashboard.css";
interface TestimonialFormModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({
  open,
  onClose,
  onAdded,
}) => {
  const [review, setReview] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorImg, setAuthorImg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await addTestimonial({ review, authorName, authorRole, authorImg });
      setStatus("success");
      setMessage("Témoignage ajouté !");
      setReview("");
      setAuthorName("");
      setAuthorRole("");
      setAuthorImg("");
      onAdded();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Erreur lors de l'ajout.");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un témoignage">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Auteur"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Rôle"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="URL de l'image"
          value={authorImg}
          onChange={(e) => setAuthorImg(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded min-h-[80px]"
          placeholder="Commentaire"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
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
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Ajout..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestimonialFormModal;