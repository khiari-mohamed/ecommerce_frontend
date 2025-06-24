import React, { useState } from "react";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import  Button  from "../ui/Button";
import  Modal  from "../ui/Modal";
import { sendCampaign } from "../../utils/fetchNewsletterSubscribers";
import "../../styles/dashboard.css";
interface NewsletterCampaignModalProps {
  open: boolean;
  onClose: () => void;
  subscribers: NewsletterSubscriber[];
}

const NewsletterCampaignModal: React.FC<NewsletterCampaignModalProps> = ({
  open,
  onClose,
  subscribers,
}) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setSending(true);
    setMessage("");
    try {
      await sendCampaign(subject, body, subscribers.map((s) => s.email));
      setMessage("Campagne envoyée avec succès !");
      setSubject("");
      setBody("");
    } catch (err: any) {
      setMessage(err.message || "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Envoyer une campagne">
      <div className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Sujet"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="border p-2 rounded min-h-[120px]"
          placeholder="Contenu de l'email (HTML autorisé)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {message && (
          <div className="text-sm text-center text-green-600">{message}</div>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" disabled={sending}>
            Annuler
          </Button>
          <Button onClick={handleSend} disabled={sending || !subject || !body}>
            {sending ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewsletterCampaignModal;