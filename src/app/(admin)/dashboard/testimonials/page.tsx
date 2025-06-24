"use client";
import React, { useEffect, useState } from "react";
import { Testimonial } from "@/types/testimonial";
import { getAllTestimonials } from "../utils/testimonials";
import TestimonialsTable from "../components/ecommerce/TestimonialsTable";
import  Button  from "../components/ui/Button";
import TestimonialFormModal from "../components/modals/TestimonialFormModal";
import TestimonialViewModal from "../components/modals/TestimonialViewModal";
import "../styles/dashboard.css"; // Import the dashboard CSS
const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (e) {
      // handle error (toast, etc)
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="dashboard-brands-page">
      <div className="dashboard-header">
        <h1>Gestion des Témoignages</h1>
        <Button onClick={() => setAddOpen(true)}>
          Ajouter un témoignage
        </Button>
      </div>
      <TestimonialsTable
        testimonials={testimonials}
        loading={loading}
        refresh={fetchTestimonials}
        onView={(testimonial) => {
          setSelected(testimonial);
          setViewOpen(true);
        }}
      />
      <TestimonialFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={fetchTestimonials}
      />
      <TestimonialViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        testimonial={selected}
      />
    </div>
  );
};

export default TestimonialsPage;