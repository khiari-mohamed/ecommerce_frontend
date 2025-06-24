"use client";
import React, { useEffect, useState } from "react";
import { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import {
  getAllSubscribers,
} from "../utils/fetchNewsletterSubscribers";
import NewsletterTable from "../components/ecommerce/NewsletterTable";
import NewsletterCampaignModal from "../components/modals/NewsletterCampaignModal";
import NewsletterStats from "../components/newsletter/NewsletterStats";
import  Button  from "../components/ui/Button";
import "../styles/dashboard.css";

const NewsletterPage = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await getAllSubscribers();
      setSubscribers(data);
    } catch (e) {
      // handle error (toast, etc)
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="dashboard-brands-page">
      <div className="dashboard-header">
        <h1>Gestion des abonnés Newsletter</h1>
        <Button onClick={() => setShowCampaignModal(true)}>
          Envoyer une campagne
        </Button>
      </div>
      <NewsletterStats subscribers={subscribers} loading={loading} />
      <NewsletterTable
        subscribers={subscribers}
        loading={loading}
        refresh={fetchSubscribers}
      />
      <NewsletterCampaignModal
        open={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        subscribers={subscribers}
      />
    </div>
  );
};

export default NewsletterPage;