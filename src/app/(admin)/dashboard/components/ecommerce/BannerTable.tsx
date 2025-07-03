import React from "react";
import Image from "next/image";
import { Banner } from "@/types/banner";
import Button from "../ui/Button";
import "../../styles/dashboard.css";

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onView: (banner: Banner) => void;
}

const BannerTable: React.FC<BannerTableProps> = ({
  banners,
  onEdit,
  onDelete,
  onView,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded">
      <thead>
        <tr>
          <th className="px-4 py-2">Image</th>
          <th className="px-4 py-2">Titre</th>
          <th className="px-4 py-2">Lien</th>
          <th className="px-4 py-2">Actif</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {banners.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-6 text-gray-500">
              Aucun banner trouvé.
            </td>
          </tr>
        ) : (
          banners.map((banner) => (
            <tr key={banner._id}>
              <td className="px-4 py-2">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  width={120}
                  height={48}
                  className="h-12 w-auto rounded"
                  style={{ maxWidth: 120, objectFit: "cover" }}
                  loading="lazy"
                />
              </td>
              <td className="px-4 py-2">{banner.title}</td>
              <td className="px-4 py-2">
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {banner.linkUrl}
                </a>
              </td>
              <td className="px-4 py-2">
                {banner.isActive ? (
                  <span className="text-green-600 font-semibold">Oui</span>
                ) : (
                  <span className="text-red-600 font-semibold">Non</span>
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(banner)}>
                  Voir
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onEdit(banner)}>
                  Modifier
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(banner)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default BannerTable;