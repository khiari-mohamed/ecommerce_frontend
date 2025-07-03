import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import "../../styles/dashboard.css";
interface ProductViewModalProps {
  product: Product;
  onClose: () => void;
}
const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, onClose }) => {
  return (
    <Modal open onClose={onClose} title="Product Details" size="md">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Image
            src={
              product.cover
                ? (product.cover.startsWith("http") ? product.cover : "/" + product.cover.replace(/^\/+/, ""))
                : product.mainImage?.url
                ? (product.mainImage.url.startsWith("http") ? product.mainImage.url : "/" + product.mainImage.url.replace(/^\/+/, ""))
                : product.images && product.images.length > 0 && product.images[0].url
                ? product.images[0].url
                : "/images/placeholder.png"
            }
            alt={product.designation}
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-xl border"
          />
          <div>
            <h2 className="text-xl font-bold">{product.designation}</h2>
            <div className="flex gap-2 mt-2">
              {product.isBestSeller && <Badge color="yellow">Best Seller</Badge>}
              {product.isNewProduct && <Badge color="green">New</Badge>}
              {product.isFlashSale && <Badge color="red">Flash Sale</Badge>}
              {product.inStock ? (
                <Badge color="green">In Stock</Badge>
              ) : (
                <Badge color="red">Out of Stock</Badge>
              )}
              {product.isPublished ? (
                <Badge color="green">Published</Badge>
              ) : (
                <Badge color="gray">Hidden</Badge>
              )}
            </div>
            <div className="mt-2 text-indigo-700 font-semibold">
              {product.price} DT{" "}
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="ml-2 line-through text-gray-400">
                  {product.oldPrice} DT
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Category:{" "}
              {typeof product.category === "object"
                ? product.category?.designation
                : product.category}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Brand: {product.brand || "—"}
            </div>
            {Array.isArray(product.aroma_ids) && product.aroma_ids.length > 0 && (
              <div className="mt-1 text-sm text-gray-500">
                Flavors/Aromas: {product.aroma_ids.join(", ")}
              </div>
            )}
            {product.promo && (
              <div className="mt-1 text-sm text-blue-700">
                Promo: <Badge color="blue">{product.promo} DT</Badge>
               {product.promoExpirationDate && (
  <span className="ml-2 text-xs text-gray-500">
    (expires: {String(product.promoExpirationDate)})
  </span>
)}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Short Description:</div>
          <div className="text-gray-700">{product.smallDescription || "—"}</div>
        </div>
        <div>
          <div className="font-semibold mb-1">Description:</div>
         <div
  className="text-gray-700"
  dangerouslySetInnerHTML={{ __html: product.description || "—" }}
/>
        </div>
        {product.nutrition_values && (
          <div>
            <div className="font-semibold mb-1">Nutrition Values:</div>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: product.nutrition_values }} />
          </div>
        )}
        {product.questions && (
          <div>
            <div className="font-semibold mb-1">Questions:</div>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: product.questions }} />
          </div>
        )}
        {(product.meta_description_fr || product.meta || product.content_seo) && (
          <div>
            <div className="font-semibold mb-1">Meta/SEO:</div>
            {product.meta_description_fr && (
              <div className="text-gray-700">
                <span className="font-semibold">Meta Description:</span>
                <span dangerouslySetInnerHTML={{ __html: product.meta_description_fr }} />
              </div>
            )}
            {product.meta && <div className="text-gray-700">Meta: {product.meta}</div>}
            {product.content_seo && <div className="text-gray-700">Content SEO: {product.content_seo}</div>}
          </div>
        )}
        {(product.zone1 || product.zone2 || product.zone3 || product.zone4) && (
          <div>
            <div className="font-semibold mb-1">Zones:</div>
            {product.zone1 && <div className="text-gray-700">Zone 1: {product.zone1}</div>}
            {product.zone2 && <div className="text-gray-700">Zone 2: {product.zone2}</div>}
            {product.zone3 && <div className="text-gray-700">Zone 3: {product.zone3}</div>}
            {product.zone4 && <div className="text-gray-700">Zone 4: {product.zone4}</div>}
          </div>
        )}
        <div className="mt-2">
          <span className="font-semibold">Reviews:</span> {Array.isArray(product.reviews) ? product.reviews.length : 0}
          <a href="/dashboard/review" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">Manage Reviews</a>
        </div>
        {product.images && product.images.length > 0 && (
          <div>
            <div className="font-semibold mb-1">Gallery:</div>
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductViewModal;