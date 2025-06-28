"use client";
import React, { useEffect, useState } from "react";
import { Banner } from "@/types/banner";
import BannerTable from "../components/ecommerce/BannerTable";
import BannerFormModal from "../components/modals/BannerFormModal";
import BannerConfirmDeleteModal from "../components/modals/BannerConfirmDeleteModal";
import BannerViewModal from "../components/modals/BannerViewModal";
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../utils/banners";
import Button from "../components/ui/Button";
import "../styles/dashboard.css";

const BannerManagementPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Partial<Banner> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [bannerToView, setBannerToView] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (e) {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = () => {
    setEditBanner(null);
    setFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditBanner(banner);
    setFormOpen(true);
  };

  const handleDelete = (banner: Banner) => {
    setBannerToDelete(banner);
    setDeleteModalOpen(true);
  };

  const handleView = (banner: Banner) => {
    setBannerToView(banner);
    setViewModalOpen(true);
  };

  const handleFormSubmit = async (banner: Partial<Banner>) => {
    try {
      if (banner._id) {
        await updateBanner(banner._id, banner);
      } else {
        await addBanner(banner);
      }
      setFormOpen(false);
      fetchBanners();
    } catch (e) {
      // handle error
    }
  };

  const handleConfirmDelete = async () => {
    if (bannerToDelete && bannerToDelete._id) {
      await deleteBanner(bannerToDelete._id);
      setDeleteModalOpen(false);
      setBannerToDelete(null);
      fetchBanners();
    }
  };

  return (
    <main className="dashboard-main-content bg-gray-50 min-h-screen">
      <div className="dashboard-container mx-auto px-4 sm:px-8 py-8 lg:ml-64">
        {/* lg:ml-64 pushes content right if sidebar is 256px (64 * 4px) */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestion des Banners</h1>
          <Button variant="primary" onClick={handleAdd}>
            Ajouter un banner
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <BannerTable
              banners={banners}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}
        </div>
        <BannerFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editBanner}
        />
        <BannerConfirmDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          banner={bannerToDelete}
        />
        <BannerViewModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          banner={bannerToView}
        />
      </div>
    </main>
  );
};

export default BannerManagementPage;