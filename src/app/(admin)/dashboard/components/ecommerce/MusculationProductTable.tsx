import React, { useEffect, useState } from "react";
import { fetchMusculationProducts } from "../../../../../services/Musculationproducts";
import { MusculationProduct } from "../../../../../types/MusculationProducts";

interface Props {
  onEdit: (product: MusculationProduct) => void;
  onView: (product: MusculationProduct) => void;
  onDelete: (product: MusculationProduct) => void;
}

export default function MusculationProductTable({ onEdit, onView, onDelete }: Props) {
  const [products, setProducts] = useState<MusculationProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMusculationProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-table-wrapper">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Promo</th>
              <th>Quantity</th>
              <th>Published</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.designation_fr}</td>
                <td>{product.slug}</td>
                <td>{product.prix}</td>
                <td>{product.promo}</td>
                <td>{product.qte}</td>
                <td>{product.publier === "1" ? "Yes" : "No"}</td>
                <td>{product.created_at ? new Date(product.created_at).toLocaleDateString() : ""}</td>
                <td>
                  <button onClick={() => onView(product)}>View</button>
                  <button onClick={() => onEdit(product)}>Edit</button>
                  <button onClick={() => onDelete(product)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}