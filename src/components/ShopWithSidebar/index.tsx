"use client";
import React, { useState, useEffect, JSX } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { getProductListPage } from "@/services/products";
import { Brand } from "@/types/brand";
import { getAllBrands } from "@/services/brand";
import { SubCategory } from "@/types/subcategory";
import { getAllSubCategories } from "@/services/subcategories";
import StarRating from "@/components/Common/StarRating";

const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [selectedSort, setSelectedSort] = useState("0");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Aromas state (REMOVED)

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(true);

  // Subcategories state (for category-product bridge)
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  // Price filter state
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number }>({ min: 10, max: 12000 });
  
  // Fetch all products and all subcategories ONCE for sidebar counts
  useEffect(() => {
  getAllBrands().then(setBrands);
  getAllSubCategories().then(setSubcategories);
  getProductListPage("limit=1000").then(res => setAllProducts(res.products));
  }, []);

  // Sorting options (implement sorting logic if needed)
  const options = [
    { label: "Derniers produits", value: "0" },
    { label: "les plus vendus", value: "1" },
    { label: "Anciens produits", value: "2" },
  ];

  // Build query string for filters and pagination
  useEffect(() => {
  setLoading(true);
  let query = "";
  const params: string[] = [];
  params.push(`sort=${selectedSort}`);
    let subCategoryDesignations: string[] = [];
    if (selectedCategories.length > 0) {
      subCategoryDesignations = subcategories
        .filter(sub => selectedCategories.includes(String(sub.id)))
        .map(sub => sub.designation)
        .filter((d): d is string => typeof d === "string"); // <-- filter out undefined
      if (subCategoryDesignations.length > 0) {
        params.push(`subCategory=${subCategoryDesignations.join(",")}`);
      }
    }

    // Aroma filter removed
    if (selectedBrands.length > 0) {
      params.push(`brand=${selectedBrands.join(",")}`);
    }
    // Add price filter
    if (selectedPriceRange.min !== 10 || selectedPriceRange.max !== 12000) {
      params.push(`minPrice=${selectedPriceRange.min}`);
      params.push(`maxPrice=${selectedPriceRange.max}`);
    }
    params.push(`page=${currentPage}`);
    if (params.length > 0) {
    query = params.join("&");
    }
    getProductListPage(query)
    .then((res) => {
    setProducts(res.products);
    setPagination(res.pagination);
    })
    .finally(() => setLoading(false));
    }, [selectedCategories, selectedBrands, subcategories, currentPage, selectedPriceRange, selectedSort]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Aroma select handler removed

  const handleBrandSelect = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id)
        ? prev.filter((brandId) => brandId !== id)
        : [...prev, id]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, [productSidebar]);

  // Pagination rendering logic with ellipsis
  const renderPagination = () => {
    if (!pagination || !pagination.totalPages) return null;
    const totalPages = pagination.totalPages;
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxPageButtons);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }

    const pages: JSX.Element[] = []; // <-- type the array

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

  function getRandomRating(key: number): number {
    // Cycle through a variety of ratings: 3, 3.5, 4, 5
    const ratings = [3, 3.5, 4, 5];
    return ratings[key % ratings.length];
  }

  function getRandomReviews(key: number): number {
    // Generate a random review count between 7 and 120, but deterministic per key
    const pseudoRandom = ((key + 1) * 37) % 114 + 7;
    return pseudoRandom;
  }

  return (
    <>
      <Breadcrumb
        title={"Explorez tous les produits"}
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Filtres open button (mobile only) */}
          <button
            onClick={() => setProductSidebar(true)}
            className="xl:hidden mb-4 px-4 py-2 bg-blue text-white rounded-md font-semibold"
            aria-label="Ouvrir les filtres"
          >
            Filtres
          </button>
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static w-full max-w-full xl:max-w-[270px] xl:w-[270px] ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full xl:translate-x-0"
              }`}
            >
              {/* Close button (mobile only) */}
              <button
                onClick={() => setProductSidebar(false)}
                aria-label="Fermer les filtres"
                className="xl:hidden absolute top-4 right-4 z-50 w-8 h-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 flex"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        className="text-blue"
                        type="button"
                        onClick={() => {
                          setSelectedCategories([]);
                          setSelectedBrands([]);
                          setCurrentPage(1);
                          }}
                          >
                        Tout nettoyer
                      </button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  {/* <!-- Catégories box --> */}
                  <div className="bg-white shadow-1 rounded-lg">
                  <CategoryDropdown
                  selectedCategories={selectedCategories}
                  onCategorySelect={handleCategorySelect}
                  products={allProducts}
                  subcategories={subcategories}
                  />
                  </div>

                  {/* <!-- aromas box removed --> */}

                  {/* <!-- Marques box (replaces color) --> */}
                  <div className="bg-white shadow-1 rounded-lg">
                  <div
                  className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
                  onClick={() => setBrandDropdownOpen((prev) => !prev)}
                  >
                  <p className="text-dark">Marques</p>
                  <button
                  aria-label="toggle brands dropdown"
                  className={`text-dark ease-out duration-200 ${brandDropdownOpen ? "rotate-180" : ""}`}
                  type="button"
                  tabIndex={-1}
                  >
                  <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
                  fill=""
                  />
                  </svg>
                  </button>
                  </div>
                  <div className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${brandDropdownOpen ? "flex" : "hidden"}`}>
                  {brands.length === 0 ? (
                  <span className="text-gray-400 text-sm">Aucune marque trouvée</span>
                  ) : (
                  brands.map((brand) => (
                  <label
                  key={brand._id}
                  className="flex items-center gap-2 cursor-pointer"
                  >
                  <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand._id)}
                  onChange={() => handleBrandSelect(brand._id)}
                  className="accent-blue"
                  />
                  <span className="text-dark">{brand.designation_fr}</span>
                  </label>
                  ))
                  )}
                  </div>
                  </div>

                  {/* <!-- Prix box --> */}
                  <div className="bg-white shadow-1 rounded-lg">
                  <div className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5">
                  <p className="text-dark">Prix</p>
                  </div>
                  <PriceDropdown
                  minPrice={10}
                  maxPrice={12000}
                  onChange={(min, max) => {
                  setSelectedPriceRange({ min, max });
                  setCurrentPage(1);
                  }}
                  />
                  </div>
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} value={selectedSort} onChange={setSelectedSort} />

                    <p>
                      Affichage{" "}
                      <span className="text-dark">
                        {products.length} de {pagination?.total || products.length}
                      </span>{" "}
                      Produits
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
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
                        <rect x="11" y="2" width="5" height="5" rx="1" fill="currentColor"/>
                        <rect x="2" y="11" width="5" height="5" rx="1" fill="currentColor"/>
                        <rect x="11" y="11" width="5" height="5" rx="1" fill="currentColor"/>
                      </svg>
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
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="3" width="14" height="3" rx="1" fill="currentColor"/>
                        <rect x="2" y="8" width="14" height="3" rx="1" fill="currentColor"/>
                        <rect x="2" y="13" width="14" height="3" rx="1" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid/List Tab Content Start --> */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {loading ? (
                  <div className="col-span-3 text-center py-10">Chargement des produits...</div>
                ) : products.length === 0 ? (
                  <div className="col-span-3 text-center py-10 text-gray-500">
                    Aucun produit trouvé.
                  </div>
                ) : (
                  products.map((item, key) => {
                    // Robust normalization logic
                    const normalized = {
                      ...item,
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
                  })
                )}
              </div>
              {/* <!-- Products Grid/List Tab Content End --> */}

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
                        disabled={!pagination || currentPage === 1}
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
                        onClick={() => setCurrentPage((prev) => pagination ? Math.min(pagination.totalPages, prev + 1) : prev)}
                        disabled={!pagination || currentPage === (pagination?.totalPages || 1)}
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

export default ShopWithSidebar;
