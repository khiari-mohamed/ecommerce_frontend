import React from "react";
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
          <img
            src={product.mainImage?.url || "/images/placeholder.png"}
            alt={product.designation}
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
        {product.images && product.images.length > 0 && (
          <div>
            <div className="font-semibold mb-1">Gallery:</div>
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
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