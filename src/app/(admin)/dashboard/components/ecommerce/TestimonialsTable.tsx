import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/testimonial";
import  Button  from "../ui/Button";
import { approveTestimonial, deleteTestimonial } from "../../utils/testimonials";
import "../../styles/dashboard.css"; // Import the dashboard CSS
interface TestimonialsTableProps {
  testimonials: Testimonial[];
  loading: boolean;
  refresh: () => void;
  onView: (testimonial: Testimonial) => void;
}

const TestimonialsTable: React.FC<TestimonialsTableProps> = ({
  testimonials,
  loading,
  refresh,
  onView,
}) => {
  const handleApprove = async (id: string) => {
    await approveTestimonial(id);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await deleteTestimonial(id);
    refresh();
  };

  return (
    <div className="dashboard-table-container">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Auteur</th>
            <th>Rôle</th>
            <th>Commentaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="empty-table">
                Chargement...
              </td>
            </tr>
          ) : testimonials.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-table">
                Aucun témoignage trouvé.
              </td>
            </tr>
          ) : (
            testimonials.map((t, idx) => (
              <tr key={idx}>
                <td>
                  <div className="flex items-center gap-2">
                    <Image
                      src={t.authorImg}
                      alt={t.authorName}
                      width={36}
                      height={36}
                      className="brand-logo"
                      style={{}}
                      priority={false}
                    />
                    <span>{t.authorName}</span>
                  </div>
                </td>
                <td>{t.authorRole}</td>
                <td>
                  <div className="truncate max-w-[320px]">{t.review}</div>
                </td>
                <td>
                  <div className="table-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onView(t)}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove((t as any)._id)}
                    >
                      Approuver
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete((t as any)._id)}
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
    </div>
  );
};

export default TestimonialsTable;