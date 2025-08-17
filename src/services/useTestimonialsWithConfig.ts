import { useEffect, useState } from "react";
import { Testimonial } from "@/types/testimonial";

interface TestimonialConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
}

interface ReviewApiResponse {
  comment: string | null;
  stars: string;
  user?: {
    name: string;
    role: string;
    avatar: string;
  };
}

export function useTestimonialsWithConfig() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [config, setConfig] = useState<TestimonialConfig>({
    sectionTitle: "Avis de nos clients",
    sectionDescription: "Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.",
    maxDisplay: 6,
    showOnFrontend: true,
  });
  const [loading, setLoading] = useState(true);

  // Listen for config changes from dashboard
  useEffect(() => {
    const handleConfigChange = (event: any) => {
      console.log('Config changed event:', event.detail);
      setConfig({
        sectionTitle: event.detail.sectionTitle || "Avis de nos clients",
        sectionDescription: event.detail.sectionDescription || "Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.",
        maxDisplay: event.detail.maxDisplay || 6,
        showOnFrontend: event.detail.showOnFrontend !== false,
      });
    };

    window.addEventListener('testimonialConfigChanged', handleConfigChange);
    return () => window.removeEventListener('testimonialConfigChanged', handleConfigChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      try {
        const [reviewsRes, configRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews/testimonials?publishedOnly=true`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/testimonial/config`)
        ]);

        // Handle testimonials
        let mapped: Testimonial[] = [];
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          if (Array.isArray(reviewsData) && reviewsData.length > 0) {
            mapped = reviewsData
              .filter((t: any) => t.comment && t.comment.trim() !== "")
              .map((review: any) => ({
                review: review.comment,
                authorName: review.user?.name || "Utilisateur",
                authorRole: review.user?.role || "",
                authorImg: review.user?.avatar || "",
                stars: review.stars || "5",
              }));
          }
        }

        // Handle config
        if (configRes.ok) {
          const configData = await configRes.json();
          console.log('Frontend config data:', configData);
          if (configData && isMounted) {
            const newConfig = {
              sectionTitle: configData.sectionTitle || "Avis de nos clients",
              sectionDescription: configData.sectionDescription || "Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.",
              maxDisplay: configData.maxDisplay || 6,
              showOnFrontend: configData.showOnFrontend !== false,
            };
            console.log('Setting frontend config:', newConfig);
            setConfig(newConfig);
          }
        } else {
          console.log('Config fetch failed, trying localStorage:', configRes.status);
          // Try localStorage fallback
          const saved = localStorage.getItem('testimonialConfig');
          if (saved && isMounted) {
            const configData = JSON.parse(saved);
            const newConfig = {
              sectionTitle: configData.sectionTitle || "Avis de nos clients",
              sectionDescription: configData.sectionDescription || "Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.",
              maxDisplay: configData.maxDisplay || 6,
              showOnFrontend: configData.showOnFrontend !== false,
            };
            console.log('Using localStorage config:', newConfig);
            setConfig(newConfig);
          }
        }

        if (isMounted) {
          setTestimonials(mapped);
        }
      } catch (e) {
        console.error("Error fetching testimonials or config:", e);
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply maxDisplay limit and showOnFrontend filter
  const displayedTestimonials = config.showOnFrontend 
    ? testimonials.slice(0, config.maxDisplay) 
    : [];

  return { 
    testimonials: displayedTestimonials, 
    config, 
    loading,
    showSection: config.showOnFrontend 
  };
}