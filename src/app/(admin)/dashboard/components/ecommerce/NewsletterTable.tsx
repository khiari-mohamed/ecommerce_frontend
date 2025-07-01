import React, { useState } from "react";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import  Button  from "../ui/Button";
import NewsletterViewModal from "../modals/NewsletterViewModal";
import NewsletterFormModal from "../modals/NewsletterFormModal";
import { deleteSubscriber } from "../../utils/fetchNewsletterSubscribers";
import "../../styles/dashboard.css";
interface NewsletterTableProps {
  subscribers: NewsletterSubscriber[];
  loading: boolean;
  refresh: () => void;
}

const NewsletterTable: React.FC<NewsletterTableProps> = ({
  subscribers,
  loading,
  refresh,
}) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<NewsletterSubscriber | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    await deleteSubscriber(id);
    refresh();
  };

  return (
    <div className="dashboard-table-container">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Liste des abonnés</span>
        <Button onClick={() => setAddOpen(true)} size="sm">
          + Ajouter un abonné
        </Button>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Date dinscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="empty-table">
                Chargement...
              </td>
            </tr>
          ) : subscribers.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty-table">
                Aucun abonné trouvé.
              </td>
            </tr>
          ) : (
            subscribers.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.email}</td>
                <td>{sub.created_at}</td>
                <td>
                  <div className="table-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelected(sub);
                        setViewOpen(true);
                      }}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(sub._id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <NewsletterViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        subscriber={selected}
      />
      <NewsletterFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={refresh}
      />
    </div>
  );
};

export default NewsletterTable;