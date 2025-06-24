import React from "react";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import { isThisMonth, parseISO } from "date-fns";
import "../../styles/dashboard.css";

interface NewsletterStatsProps {
  subscribers: NewsletterSubscriber[];
  loading: boolean;
}

const NewsletterStats: React.FC<NewsletterStatsProps> = ({
  subscribers,
  loading,
}) => {
  if (loading) return null;

  const total = subscribers.length;
  const newThisMonth = subscribers.filter((s) =>
    isThisMonth(parseISO(s.created_at))
  ).length;

  return (
    <div className="flex gap-8 mb-4">
      <div>
        <div className="text-lg font-bold">{total}</div>
        <div className="text-gray-500">Total abonnés</div>
      </div>
      <div>
        <div className="text-lg font-bold">{newThisMonth}</div>
        <div className="text-gray-500">Nouveaux ce mois</div>
      </div>
    </div>
  );
};

export default NewsletterStats;