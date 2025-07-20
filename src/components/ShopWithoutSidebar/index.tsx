"use client";
import React, { useState, useEffect, JSX } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import CustomSelect from "../ShopWithSidebar/CustomSelect";
import { getProductListPage } from "@/services/products";
import StarRating from "@/components/Common/StarRating";

const ShopWithoutSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const options = [
    { label: "Derniers produits", value: "0" },
    { label: "Meilleures ventes", value: "1" },
    { label: "Anciens produits", value: "2" },
  ];
  const [selectedSort, setSelectedSort] = useState(options[0].value);
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    // Add sorting logic here if needed
  };

  // Fetch products for the current page
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Pass page and sort as query params
        const response = await getProductListPage(`page=${currentPage}&sort=${selectedSort}`);
        // Use the normalized product object directly!
        setShopData(response.products);

        // Set total pages and total products if available
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotalProducts(response.pagination.totalItems || response.products.length);
        } else {
          setTotalPages(1);
          setTotalProducts(response.products.length);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedSort]);

  // Pagination rendering logic with ellipsis
  const renderPagination = (): JSX.Element[] => {
    const pages: JSX.Element[] = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxPageButtons);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <li key={1}>
          <button
            onClick={() => setCurrentPage(1)}
            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${currentPage === 1 ? "bg-blue text-white" : "hover:text-white hover:bg-blue"}`}
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

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue; // Already rendered
      pages.push(
        <li key={i}>
          <button
            onClick={() => setCurrentPage(i)}
            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${currentPage === i ? "bg-blue text-white" : "hover:text-white hover:bg-blue"}`}
            disabled={currentPage === i}
          >
            {i}
          </button>
        </li>
      );
    }

    // Last page
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
            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${currentPage === totalPages ? "bg-blue text-white" : "hover:text-white hover:bg-blue"}`}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  const staticRatings = [3, 3.5, 4, 5];
  function getRandomRating(idx: number) {
    return staticRatings[idx % staticRatings.length];
  }
  function getRandomReviews(idx: number) {
    return 7 + ((idx * 13) % 114); // 7 to 120 reviews, deterministic per idx
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f3f4f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        title={"Explorez tous les produits"}
        pages={["shop", "/", "shop without sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            <div className="w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} value={selectedSort} onChange={handleSortChange} />

                    <p>
                      Showing <span className="text-dark">{shopData.length} of {totalProducts}</span>{" "}
                      Products
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      {/* grid icon */}
                      {/* ...svg omitted... */}
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      {/* list icon */}
                      {/* ...svg omitted... */}
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {shopData.map((item, key) => {
                  // Robust normalization logic
                  const normalized = {
                    ...item,
                    designation: item.designation || item.designation_fr || item.title || "",
                    title: item.title || item.designation || item.designation_fr || "",
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
                    mainImage: item.mainImage || { url: item.cover || "" },
                    cover: item.cover || item.mainImage?.url || "",
                  };
                  return productStyle === "grid" ? (
                    <div key={key}>
                      <SingleGridItem item={normalized} />
                      <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={getRandomRating(key)} />
                        <span className="text-xs text-gray-500">
                          ({getRandomReviews(key)} avis)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key={key}>
                      <SingleListItem item={normalized} />
                      <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={getRandomRating(key)} />
                        <span className="text-xs text-gray-500">
                          ({getRandomReviews(key)} avis)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    {/* Previous Button */}
                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="button for pagination left"
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                    {/* Page Numbers */}
                    {renderPagination()}
                    {/* Next Button */}
                    <li>
                      <button
                        id="paginationRight"
                        aria-label="button for pagination right"
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;