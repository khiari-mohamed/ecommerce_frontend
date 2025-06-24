"use client";
import React, { useEffect, useState } from "react";
import { Banner } from "@/types/banner";
import BannerTable from "../components/ecommerce/BannerTable";
import BannerFormModal from "../components/modals/BannerFormModal";
import BannerConfirmDeleteModal from "../components/modals/BannerConfirmDeleteModal";
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
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

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

  const handleFormSubmit = async (banner: Banner) => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Banners</h1>
        <Button variant="primary" onClick={handleAdd}>
          Ajouter un banner
        </Button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <BannerTable banners={banners} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {/* Modal wrappers are handled inside each modal component */}
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
    </div>
  );
};

export default BannerManagementPage;
