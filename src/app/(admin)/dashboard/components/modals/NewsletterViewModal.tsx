import React from "react";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import Modal  from "../ui/Modal";
import { format } from "date-fns";
import "../../styles/dashboard.css";
interface NewsletterViewModalProps {
  open: boolean;
  onClose: () => void;
  subscriber: NewsletterSubscriber | null;
}

const NewsletterViewModal: React.FC<NewsletterViewModalProps> = ({
  open,
  onClose,
  subscriber,
}) => {
  if (!subscriber) return null;
  return (
    <Modal open={open} onClose={onClose} title="Détails de l'abonné">
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-semibold">Email:</span> {subscriber.email}
        </div>
        <div>
          <span className="font-semibold">Inscrit le:</span>{" "}
          {subscriber.created_at
            ? format(new Date(subscriber.created_at), "yyyy-MM-dd HH:mm")
            : "-"}
        </div>
        <div>
          <span className="font-semibold">Mis à jour le:</span>{" "}
          {subscriber.updated_at
            ? format(new Date(subscriber.updated_at), "yyyy-MM-dd HH:mm")
            : "-"}
        </div>
        <div>
          <span className="font-semibold">ID:</span> {subscriber._id}
        </div>
      </div>
    </Modal>
  );
};

export default NewsletterViewModal;