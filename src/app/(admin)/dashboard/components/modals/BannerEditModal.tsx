import React from "react";
import { Banner } from "@/types/banner";
import BannerFormModal from "./BannerFormModal";
import "../../styles/dashboard.css";

interface BannerEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (banner: Banner) => void;
  banner: Banner | null;
}

const BannerEditModal: React.FC<BannerEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  banner,
}) => (
  <BannerFormModal
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
    initialData={banner}
  />
);

export default BannerEditModal;
