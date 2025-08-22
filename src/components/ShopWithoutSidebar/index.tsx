"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import { getProductListPage } from "@/services/products";

const ShopWithoutSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProductListPage(`page=${currentPage}`);
        setShopData(response.products);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  function getRandomRating(idx: number) {
    return 5;
  }
  function getRandomReviews(idx: number) {
    return 7 + ((idx * 13) % 114);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <Breadcrumb
        title={"Explorez tous les produits"}
        pages={["shop", "/", "shop without sidebar"]}
      />
      <section className="py-8 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {shopData.map((item, key) => {
              const normalized = {
                ...item,
                designation: item.designation || item.designation_fr || item.title || "Produit",
                title: item.title || item.designation || item.designation_fr || "Produit",
                price: Number(item.price ?? item.prix ?? item.discountedPrice ?? item.promo ?? 0),
                oldPrice: Number(
                  item.oldPrice ??
                  (item.price && item.discountedPrice && item.price > item.discountedPrice ? item.price :
                  item.prix && item.promo && item.prix > item.promo ? item.prix : 0)
                ) || null,
                discountedPrice: Number(item.discountedPrice ?? item.promo ?? item.price ?? item.prix ?? 0),
                slug: item.slug ?? item._id ?? item.id ?? 'product',
                imgs: item.imgs && item.imgs.thumbnails?.length > 0 && item.imgs.previews?.length > 0
                  ? item.imgs
                  : {
                      thumbnails: (
                        item.images && Array.isArray(item.images) && item.images.length > 0
                          ? item.images.map((img) => img.url)
                          : item.mainImage?.url
                          ? [item.mainImage.url]
                          : []
                      ),
                      previews: (
                        item.images && Array.isArray(item.images) && item.images.length > 0
                          ? item.images.map((img) => img.url)
                          : item.mainImage?.url
                          ? [item.mainImage.url]
                          : []
                      ),
                    },
                mainImage: item.mainImage ?? { url: item.cover ?? "" },
                cover: item.cover ?? item.mainImage?.url ?? "",
              };

              normalized.designation = normalized.designation || "Produit";
              normalized.price = typeof normalized.price === "number" ? normalized.price : 0;
              normalized.oldPrice = typeof normalized.oldPrice === "number" ? normalized.oldPrice : null;
              normalized.slug = normalized.slug || "product";
              normalized.cover = normalized.cover || "/placeholder.svg";

              return (
                <SingleGridItem key={key} item={normalized} rating={getRandomRating(key)} reviewsCount={getRandomReviews(key)} />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-15">
              <div className="bg-white shadow-1 rounded-md p-2">
                <ul className="flex items-center">
                  <li>
                    <button
                      aria-label="button for pagination left"
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z" fill="" />
                      </svg>
                    </button>
                  </li>
                  {(() => {
                    const pages: React.ReactElement[] = [];
                    const maxPageButtons = 5;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, currentPage + 2);

                    if (currentPage <= 3) {
                      endPage = Math.min(totalPages, maxPageButtons);
                    } else if (currentPage >= totalPages - 2) {
                      startPage = Math.max(1, totalPages - maxPageButtons + 1);
                    }

                    if (startPage > 1) {
                      pages.push(
                        <li key={1}>
                          <button
                            onClick={() => setCurrentPage(1)}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                              currentPage === 1 ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                            }`}
                            disabled={currentPage === 1}
                          >
                            1
                          </button>
                        </li>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <li key="start-ellipsis">
                            <span className="flex py-1.5 px-3.5">...</span>
                          </li>
                        );
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      if (i === 1 || i === totalPages) continue;
                      pages.push(
                        <li key={i}>
                          <button
                            onClick={() => setCurrentPage(i)}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                              currentPage === i ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                            }`}
                            disabled={currentPage === i}
                          >
                            {i}
                          </button>
                        </li>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <li key="end-ellipsis">
                            <span className="flex py-1.5 px-3.5">...</span>
                          </li>
                        );
                      }
                      pages.push(
                        <li key={totalPages}>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                              currentPage === totalPages ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                            }`}
                            disabled={currentPage === totalPages}
                          >
                            {totalPages}
                          </button>
                        </li>
                      );
                    }

                    return pages;
                  })()}
                  <li>
                    <button
                      aria-label="button for pagination right"
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z" fill="" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopWithoutSidebar;