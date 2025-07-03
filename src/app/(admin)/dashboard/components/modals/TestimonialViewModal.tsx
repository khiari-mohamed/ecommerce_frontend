import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/testimonial";
import  Modal  from "../ui/Modal";
import "../../styles/dashboard.css";
interface TestimonialViewModalProps {
  open: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
}

const TestimonialViewModal: React.FC<TestimonialViewModalProps> = ({
  open,
  onClose,
  testimonial,
}) => {
  if (!testimonial) return null;
  return (
    <Modal open={open} onClose={onClose} title="Détails du témoignage">
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-semibold">Auteur:</span> {testimonial.authorName}
        </div>
        <div>
          <span className="font-semibold">Rôle:</span> {testimonial.authorRole}
        </div>
        <div>
          <span className="font-semibold">Image:</span>
          <Image
            src={testimonial.authorImg}
            alt={testimonial.authorName}
            width={48}
            height={48}
            className="brand-logo"
            style={{ marginLeft: 8 }}
            priority={false}
          />
        </div>
        <div>
          <span className="font-semibold">Commentaire:</span>
          <div className="mt-2">{testimonial.review}</div>
        </div>
      </div>
    </Modal>
  );
};

export default TestimonialViewModal;