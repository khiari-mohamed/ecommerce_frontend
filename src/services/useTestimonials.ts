
import { useEffect, useState } from "react";
import { Testimonial } from "@/types/testimonial";
import testimonialsData from "./../components/Home/Testimonials/testimonialsData";

interface ReviewApiResponse {
  comment: string | null;
  user?: {
    name: string;
    role: string;
    img: string;
  };
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTestimonials() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/reviews?publishedOnly=true");
        if (!res.ok) throw new Error("Network error");
        const data: ReviewApiResponse[] = await res.json();

        // Filter out reviews with null/empty comment
        const filtered = data.filter((t) => t.comment && t.comment.trim() !== "");

        // If there are reviews, map each to a random static author
        let mapped: Testimonial[] = [];
        if (filtered.length > 0) {
          // Shuffle static data to randomize author assignment
          const shuffledAuthors = shuffleArray(testimonialsData);

          mapped = filtered.map((review, idx) => {
            // Cycle through shuffledAuthors if there are more reviews than authors
            const author = shuffledAuthors[idx % shuffledAuthors.length];
            return {
              review: review.comment!,
              authorName: author.authorName,
              authorRole: author.authorRole,
              authorImg: author.authorImg,
            };
          });

          // Shuffle the mapped testimonials for random display order
          mapped = shuffleArray(mapped);
        }

        if (isMounted) {
          setTestimonials(mapped.length > 0 ? mapped : shuffleArray(testimonialsData));
        }
      } catch (e) {
        // Fallback to shuffled static data
        if (isMounted) setTestimonials(shuffleArray(testimonialsData));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, loading };
}
