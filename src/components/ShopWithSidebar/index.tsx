"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { getProductListPage } from "@/services/products";
import { Aroma } from "@/types/aroma";
import { getAllAromas } from "@/services/aroma";
import { Brand } from "@/types/brand";
import { getAllBrands } from "@/services/brand";
import { SubCategory } from "@/types/subcategory";
import { getAllSubCategories } from "@/services/subcategories";
import StarRating from "@/components/Common/StarRating";

const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Aromas state
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [aromaDropdownOpen, setAromaDropdownOpen] = useState(true);

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(true);

  // Subcategories state (for category-product bridge)
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  // Fetch all products and all subcategories ONCE for sidebar counts
  useEffect(() => {
    getAllAromas().then(setAromas);
    getAllBrands().then(setBrands);
    getAllSubCategories().then(setSubcategories);
    getProductListPage("limit=1000").then(res => setAllProducts(res.products));
  }, []);

  // Sorting options (implement sorting logic if needed)
  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  // Build query string for filters and pagination
  useEffect(() => {
    setLoading(true);
    let query = "";
    const params: string[] = [];

    // If categories are selected, convert them to subcategory IDs
    let subcategoryIds: string[] = [];
    if (selectedCategories.length > 0) {
      subcategoryIds = subcategories
        .filter(sub => selectedCategories.includes(String(sub.categorie_id)))
        .map(sub => String(sub.id));
      if (subcategoryIds.length > 0) {
        params.push(`subcategory=${subcategoryIds.join(",")}`);
      }
    }

    if (selectedAromas.length > 0) {
      params.push(`aroma=${selectedAromas.join(",")}`);
    }
    if (selectedBrands.length > 0) {
      params.push(`brand=${selectedBrands.join(",")}`);
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
  }, [selectedCategories, selectedAromas, selectedBrands, subcategories, currentPage]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleAromaSelect = (id: string) => {
    setSelectedAromas((prev) =>
      prev.includes(id)
        ? prev.filter((aromaId) => aromaId !== id)
        : [...prev, id]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

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

    const pages = [];

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
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
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
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
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
                          setSelectedAromas([]);
                          setSelectedBrands([]);
                          setCurrentPage(1);
                        }}
                      >
                        Tout nettoyer
                      </button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <CategoryDropdown
                    selectedCategories={selectedCategories}
                    onCategorySelect={handleCategorySelect}
                    products={allProducts}
                    subcategories={subcategories}
                  />

                  {/* <!-- aromas box --> */}
                  <div className="bg-white shadow-1 rounded-lg">
                    <div
                      className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
                      onClick={() => setAromaDropdownOpen((prev) => !prev)}
                    >
                      <p className="text-dark">Aromas</p>
                      <button
                        aria-label="toggle aromas dropdown"
                        className={`text-dark ease-out duration-200 ${aromaDropdownOpen ? "rotate-180" : ""}`}
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
                    <div className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${aromaDropdownOpen ? "flex" : "hidden"}`}>
                      {aromas.length === 0 ? (
                        <span className="text-gray-400 text-sm">Aucun arôme trouvé</span>
                      ) : (
                        aromas.map((aroma) => (
                          <label
                            key={aroma._id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAromas.includes(aroma._id)}
                              onChange={() => handleAromaSelect(aroma._id)}
                              className="accent-blue"
                            />
                            <span className="text-dark">{aroma.designation_fr}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {/* <!-- brands box (replaces color) --> */}
                  <div className="bg-white shadow-1 rounded-lg">
                    <div
                      className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
                      onClick={() => setBrandDropdownOpen((prev) => !prev)}
                    >
                      <p className="text-dark">Brands</p>
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
                        <span className="text-gray-400 text-sm">No brands found</span>
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

                  {/* <!-- price range box --> */}
                  <PriceDropdown />
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
                    <CustomSelect options={options} />

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
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
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
                  products.map((item, key) =>
                    productStyle === "grid" ? (
                      <div key={key}>
                        <SingleGridItem item={item} />
                        <div className="mt-2 flex items-center gap-2">
                          <StarRating rating={getRandomRating(key)} />
                          <span className="text-xs text-gray-500">
                            ({getRandomReviews(key)} avis)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div key={key}>
                        <SingleListItem item={item} />
                        <div className="mt-2 flex items-center gap-2">
                          <StarRating rating={getRandomRating(key)} />
                          <span className="text-xs text-gray-500">
                            ({getRandomReviews(key)} avis)
                          </span>
                        </div>
                      </div>
                    )
                  )
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
