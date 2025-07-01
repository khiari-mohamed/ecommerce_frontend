"use client";
import React, { useEffect, useState } from "react";
import { getProductListPage } from "@/services/products";
import { getReviewsByProduct } from "@/services/reviews";
import StarRating from "@/components/Common/StarRating";
import Link from "next/link";
import { Product } from "@/types/product";
import "../styles/dashboard.css";

const DashboardReviewPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsMap, setReviewsMap] = useState<{ [key: string]: any[] }>({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    async function fetchProductsAndReviews() {
      setLoading(true);
      try {
        const res = await getProductListPage("limit=1000");
        const productsList = res.products || [];
        setProducts(productsList);
        setLoadingReviews(true);
        // Fetch all reviews for all products in parallel
        const reviewsEntries: [string, any[]][] = await Promise.all(
          productsList.map(async (product) => {
            const reviewKey = product.id ? String(product.id) : product._id;
            const reviews = await getReviewsByProduct(reviewKey);
            return [reviewKey, reviews] as [string, any[]];
          })
        );
        const reviewsObj: { [key: string]: any[] } = {};
        reviewsEntries.forEach(([key, reviews]) => {
          reviewsObj[key] = reviews;
        });
        setReviewsMap(reviewsObj);
      } catch (e) {
        setProducts([]);
        setReviewsMap({});
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    }
    fetchProductsAndReviews();
  }, []);

  return (
    <section className="dashboard-reviews-section">
      <h1 className="text-2xl font-bold mb-6">Gestion des avis & notes produits</h1>
      {loading || loadingReviews ? (
        <div className="dashboard-reviews-loader">Chargement...</div>
      ) : (
        <div className="dashboard-reviews-table-wrapper">
          <table className="dashboard-reviews-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Note moyenne</th>
                <th>Nombre davis</th>
                <th>Avis</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const reviewKey = product.id ? String(product.id) : product._id;
                const reviews = reviewsMap[reviewKey] || [];
                const reviewsCount = reviews.length;
                const averageRating =
                  reviewsCount > 0
                    ? reviews.reduce((sum, r) => sum + (r.rating || parseInt(String(r.stars ?? "0"), 10)), 0) / reviewsCount
                    : 0;
                return (
                  <React.Fragment key={product._id}>
                    <tr>
                      <td>
                        <Link href={`/shop-details?slug=${product.slug}`} className="text-blue-600 hover:underline" target="_blank">
                          {product.designation}
                        </Link>
                      </td>
                      <td>
                        <StarRating rating={averageRating} />
                      </td>
                      <td>{reviewsCount}</td>
                      <td>
                        {reviewsCount === 0 ? (
                          <span className="dashboard-reviews-empty">Aucun avis</span>
                        ) : (
                          <table className="dashboard-reviews-table" style={{ margin: 0, background: "#f9fafb" }}>
                            <thead>
                              <tr>
                                <th>Utilisateur</th>
                                <th>Note</th>
                                <th>Commentaire</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reviews.map((review) => (
                                <tr key={review._id}>
                                  <td>{review.userName || review.user_id || "-"}</td>
                                  <td><StarRating rating={review.rating || parseInt(String(review.stars ?? "0"), 10)} size={14} /></td>
                                  <td>{review.comment || <span className="text-gray-400">-</span>}</td>
                                  <td>{review.created_at ? new Date(review.created_at).toLocaleDateString() : "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DashboardReviewPage;
