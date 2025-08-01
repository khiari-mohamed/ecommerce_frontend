"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Subcategory {
  designation_fr: string;
  _id: string;
  slug: string;
  name: string;
}

interface Category {
  designation_fr: any;
  _id: string;
  slug: string;
  name: string;
  subCategories?: Subcategory[];
  designation: string;
}
// OldTopHeaderBand: Black band with left text and right social icons, desktop only
const OldTopHeaderBand = () => (
  <div className="hidden xl:flex w-full bg-[#222] h-[36px] items-center justify-between px-8 text-white text-sm font-medium z-[10000]">
    <div className="flex-1 flex items-center">
      Contactez-nous&nbsp;
      <a href="tel:+21627612500" className="hover:text-[#0a58ca] underline">+216 27 612 500</a>
      &nbsp;|&nbsp;
      <a href="tel:+21673200169" className="hover:text-[#0a58ca] underline">+216 73 200 169</a>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <a
        href="https://www.google.tn/maps/place/PROTEINE+TUNISIE+%E2%80%93+SOBITAS+%7C+Creatine,+Mat%C3%A9riel+de+Musculation+%26+Whey+%C3%A0+Sousse/@35.8363493,10.630565,17z/data=!3m1!4b1!4m6!3m5!1s0x1302131b30e891b1:0x51dae0f25849b20c!8m2!3d35.8363493!4d10.630565!16s%2Fg%2F11g4j5rl1d?hl=fr&entry=ttu&g_ep=EgoyMDI1MDcwNy4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-[#0a58ca]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="18" height="18" className="inline-block mr-1"><path d="M12 2C7.031 2 3 6.031 3 11.001c0 5.25 7.125 10.575 7.426 10.792a1 1 0 0 0 1.148 0C13.875 21.576 21 16.251 21 11.001 21 6.031 16.969 2 12 2zm0 18.684C9.375 18.001 5 14.251 5 11.001 5 7.14 8.14 4 12 4s7 3.14 7 7.001c0 3.25-4.375 7-7 9.683z"/><path d="M12 6.5A4.505 4.505 0 0 0 7.5 11c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5A4.505 4.505 0 0 0 12 6.5zm0 7A2.503 2.503 0 0 1 9.5 11c0-1.378 1.122-2.5 2.5-2.5s2.5 1.122 2.5 2.5A2.503 2.503 0 0 1 12 13.5z"/></svg>
        Rue Ribat, 4000 Sousse Tunisie
      </a>
    </div>
    <div className="flex-1 flex items-center justify-end">
      Livraison gratuite à partir de 300 DT
    </div>
  </div>
);

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string; _id?: string; image?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdownDesktop, setShowCategoryDropdownDesktop] = useState(false);
  const [showCategoryDropdownMobile, setShowCategoryDropdownMobile] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const navigationOpenRef = useRef(navigationOpen);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [hideTopHeader, setHideTopHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    navigationOpenRef.current = navigationOpen;
  }, [navigationOpen]);

  // Sticky menu handler
  const handleStickyMenu = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY >= 80) {
      setStickyMenu(true);
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setHideTopHeader(true);
      } else {
        setHideTopHeader(false);
      }
    } else {
      setStickyMenu(false);
      setHideTopHeader(false);
    }
    setLastScrollY(currentScrollY);
    if (!navigationOpenRef.current) {
      setNavigationOpen(false);
      document.body.classList.remove('mobile-nav-open');
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (navigationOpen) {
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.classList.remove('mobile-nav-open');
    }
  }, [navigationOpen]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/categories?populate=subcategories");
        setCategories(res.data || []);
        console.log("CATEGORIES:", res.data.data);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`/products/autocomplete?query=${encodeURIComponent(searchQuery.trim())}`);
        // Ensure each suggestion includes id/_id
        const data = Array.isArray(res.data)
          ? res.data.map((item: any) => ({
              name: item.name || item.designation_fr || item.designation,
              slug: item.slug,
              _id: item._id,
              image: item.mainImage?.url || item.cover,
            }))
          : [];
        setSuggestions(data); // <-- THIS LINE FIXES THE ISSUE
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: { name: string; slug: string; id?: string; _id?: string }) => {
    if (!suggestion.slug) return;
    setSearchQuery(suggestion.name || "");
    setShowSuggestions(false);
    router.push(`/shop/${suggestion.slug}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <header
        className="fixed left-0 top-0 w-full z-[9999] bg-white transition-all ease-in-out duration-300"
        style={{
          pointerEvents: hideTopHeader ? 'none' : (navigationOpen ? 'auto' : undefined),
          height: hideTopHeader ? 0 : undefined,
          minHeight: hideTopHeader ? 0 : undefined,
          maxHeight: hideTopHeader ? 0 : undefined,
          padding: hideTopHeader ? 0 : undefined,
          overflow: hideTopHeader ? 'hidden' : undefined,
          transition: 'height 0.3s, min-height 0.3s, max-height 0.3s, padding 0.3s, pointer-events 0.3s',
        }}
      >
        <OldTopHeaderBand />
      {/* Hamburger Mobile Menu (mobile only, must be outside main header row to avoid clipping) */}
      <div className={`fixed top-0 left-0 w-screen h-screen z-[99999] transition-opacity duration-300 ${navigationOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} xl:hidden overflow-y-auto`} style={{ background: navigationOpen ? 'rgba(0,0,0,0.95)' : 'transparent', display: navigationOpen ? 'block' : 'none' }}>
        <div className="relative min-h-screen w-full flex flex-col bg-white max-w-none" style={{ zIndex: 100000, minWidth: 0, maxWidth: '100vw', padding: 0 }}>
          <button aria-label="Fermer" className="absolute top-4 right-4 z-[10001] w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 xl:hidden" onClick={() => setNavigationOpen(false)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="flex-1 flex flex-col p-5 pt-16 overflow-y-auto" style={{overflow: 'visible'}}>
            {/* Search bar and category dropdown in menu */}
            <form onSubmit={handleSearch} autoComplete="off" className="w-full flex items-center rounded-md border border-gray-3 bg-white relative mb-4" style={{overflow: 'visible'}}>
              <div className="relative w-[140px] z-[30000]">
                <button
                  type="button"
                  className="h-12 px-3 text-sm bg-white border-0 outline-none w-full text-left flex items-center justify-between border border-gray-3 rounded-md"
                  onClick={() => {/* Disable click when menu is open and dropdown is already shown */}}
                  aria-haspopup="listbox"
                  aria-expanded={showCategoryDropdownMobile}
                  disabled={navigationOpen && showCategoryDropdownMobile}
                  style={navigationOpen && showCategoryDropdownMobile ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                >
                  {selectedCategory
                    ? (categories.find(cat => cat.slug === selectedCategory)?.name || "Toutes catégories")
                    : "Toutes catégories"}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showCategoryDropdownMobile && (
                  <ul className="absolute left-0 top-full w-full bg-white border border-gray-3 rounded-b shadow-lg max-h-60 overflow-y-auto z-[40000]"
                  style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  overflow: 'visible',
                  }}
                  role="listbox"
                  >
                    <li
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-2 ${!selectedCategory ? 'font-bold text-blue' : ''}`}
                      onClick={() => { setSelectedCategory(""); setShowCategoryDropdownMobile(false); }}
                      role="option"
                      aria-selected={!selectedCategory}
                    >
                      Toutes catégories
                    </li>
                    {categories.map(cat => (
                      <React.Fragment key={cat._id}>
                        <li
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-2 font-medium ${selectedCategory === cat.slug ? 'text-blue font-bold' : ''}`}
                          onClick={() => { setSelectedCategory(cat.slug); setShowCategoryDropdownMobile(false); router.push(`/categories/${cat.slug}`); }}
                          role="option"
                          aria-selected={selectedCategory === cat.slug}
                        >
                          {cat.designation_fr || cat.designation}
                        </li>
                        {cat.subCategories && Array.isArray(cat.subCategories) && cat.subCategories.map(subcat => (
                        <li
                        key={subcat._id}
                        className="pl-8 pr-4 py-2 cursor-pointer hover:bg-gray-1 text-sm text-gray-700"
                        onClick={() => { setShowCategoryDropdownMobile(false); router.push(`/subcategories/${subcat.slug}`); }}
                        role="option"
                        aria-selected={false}
                        >
                        {subcat.designation_fr || subcat.name}
                        </li>
                        ))}
                      </React.Fragment>
                    ))}
                  </ul>
                )}
              </div>
              <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery ?? ""} type="search" name="search" id="search-mobile" placeholder="je fais des emplettes pour..." autoComplete="off" className="flex-1 border-0 outline-none px-4 py-3 text-sm min-w-0 bg-white" onFocus={() => searchQuery && setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} style={{height: '48px'}} />
              {/* FIX: Suggestions dropdown for mobile */}
              {showSuggestions && (
                <ul
                  className="absolute left-0 top-full w-full bg-white border border-gray-3 rounded-b shadow-lg max-h-60 overflow-y-auto z-[40000]"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  }}
                >
                  {loadingSuggestions ? (
                    <li className="px-4 py-2 text-gray-500">Chargement...</li>
                  ) : suggestions.length === 0 ? (
                    <li className="px-4 py-2 text-gray-400">Aucune suggestion</li>
                  ) : (
                    suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-2"
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >

                        {suggestion.image && (
            <img
              src={`/${suggestion.image}`}
              alt={suggestion.name}
              className="w-10 h-10 object-cover rounded"
              style={{ minWidth: 40, minHeight: 40 }}
            />
          )}
                        {suggestion.name || "Produit sans nom"}
                      </li>
                    ))
                  )}
                </ul>
              )}
              <button id="search-btn-mobile" aria-label="Search" className="flex items-center justify-center px-4 h-12 text-blue hover:text-blue-700" type="submit">
                <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" fill="#ff4500"/></svg>
              </button>
            </form>
            {/* Navigation links in menu */}
            <nav>
              <ul className="flex flex-col gap-5">
                {loadingCategories ? (<li>Chargement...</li>) : (categories.map((category) => (
                  <li key={category._id} className="group relative">
                    <Link href={`/categories/${category.slug}`} className="hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize" onClick={() => setNavigationOpen(false)}>{category.designation_fr || category.designation}</Link>
                    {category.subCategories && category.subCategories.length > 0 && (
                    <ul className="pl-4 mt-1">
                    {category.subCategories.map((subcat) => (
                    <li key={subcat._id}>
                    <Link href={`/subcategories/${subcat.slug}`} className="block px-2 py-1 text-custom-sm hover:text-blue hover:bg-gray-1" onClick={() => setNavigationOpen(false)}>{subcat.designation_fr || subcat.name}</Link>
                    </li>
                    ))}
                    </ul>
                    )}
                  </li>
                )))}
                {menuData.map((menuItem, i) => menuItem.submenu ? (
                  <Dropdown key={`static-mobile-${i}`} menuItem={menuItem} stickyMenu={stickyMenu} />
                ) : (
                  menuItem.path ? (
                    <li key={`static-mobile-${i}`} className="group relative">
                      <Link href={menuItem.path as string} className="hover:text-blue text-custom-sm font-medium text-dark flex items-center" onClick={() => setNavigationOpen(false)}>{menuItem.title}{menuItem.showBadge && (<span className="intense-flashing-badge text-xs px-1 py-0.5" style={{ fontSize: '0.65rem', position: 'relative', top: '-4px' }}>Limitée!</span>)}</Link>
                    </li>
                  ) : null
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* Main header row */}
      <div className="flex items-center justify-between w-full px-2 sm:px-4 xl:px-16 min-h-[56px] h-[56px] xl:min-h-[80px] xl:h-[80px] bg-white overflow-visible" style={{overflow: 'visible'}}>
        {/* Logo + Dropdown + Search bar (desktop/tablet only) */}
        <div className="flex items-center min-w-0 w-auto overflow-visible h-[40px] xl:h-[80px]">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={200}
              height={80}
              className="object-contain w-[100px] h-[32px] xl:w-[200px] xl:h-[80px]"
              priority
            />
          </Link>
          {/* Small space between logo and search+dropdown */}
          <div className="hidden xl:block" style={{ width: 30 }} /> {/* 20px gap, slightly bigger than before */}
          {/* Dropdown + Search bar (desktop/tablet only) */}
          <div className="hidden xl:flex items-center min-w-0">
            <form
              onSubmit={handleSearch}
              autoComplete="off"
              className={`search-bar-header flex items-center rounded-md border border-gray-3 bg-white relative transition-all duration-200 w-[220px] focus-within:w-[520px]`}
              style={{overflow: 'visible', maxWidth: 520}}
            >
              <div className="relative w-[110px] z-[30000]">
                <button
                  type="button"
                  className="h-10 px-2 text-xs bg-white border-0 outline-none w-full text-left flex items-center justify-between border border-gray-3 rounded-md"
                  onClick={() => setShowCategoryDropdownDesktop(prev => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={showCategoryDropdownDesktop}
                >
                  {selectedCategory
                  ? (categories.find(cat => cat.slug === selectedCategory)?.designation_fr || categories.find(cat => cat.slug === selectedCategory)?.name || "Toutes catégories")
                  : "Toutes catégories"}
                  <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showCategoryDropdownDesktop && (
                <div className="absolute left-0 top-full w-[220px] bg-white border border-gray-3 rounded-b shadow-lg max-h-80 overflow-y-auto z-[40000]" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)', overflow: 'auto' }}>
                  <ul role="listbox" className="max-h-80 overflow-y-auto">
                  <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-2 ${!selectedCategory ? 'font-bold text-blue' : ''}`}
                  onClick={() => { setSelectedCategory(""); setShowCategoryDropdownDesktop(false); }}
                  role="option"
                  aria-selected={!selectedCategory}
                  >
                  Toutes catégories
                  </li>
                  {categories.map(cat => (
                  <li key={cat._id} className="">
                  <div
                  className="px-4 pt-3 pb-1 font-bold text-base text-[#222]"
                  style={{ fontWeight: 700, fontSize: '1.08rem' }}
                  >
                  {cat.designation_fr || cat.name}
                  </div>
                  {cat.subCategories && cat.subCategories.length > 0 && (
                  <ul className="pl-6 pb-2">
                  {cat.subCategories.map((subcat, idx) => (
                  <li
                  key={subcat._id || idx}
                  className="pr-4 py-1 cursor-pointer hover:bg-gray-1 text-sm text-gray-700"
                  onClick={() => { setSelectedCategory(""); setShowCategoryDropdownDesktop(false); router.push(`/subcategories/${subcat.slug}`); }}
                  role="option"
                  aria-selected={false}
                  >
                  {subcat.designation_fr || subcat.name}
                  </li>
                  ))}
                  </ul>
                  )}
                  </li>
                  ))}
                  </ul>
                </div>
                )}
              </div>
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery ?? ""}
                type="search"
                name="search"
                id="search"
                placeholder="Rechercher produit..."
                autoComplete="off"
                className="flex-1 border-0 outline-none px-3 py-2 text-sm min-w-0 bg-white search-field commercekit-ajax-search transition-all duration-200"
                style={{
                  height: '40px',
                  backgroundImage: 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '50% 50%',
                  minWidth: 0,
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {/* Suggestions dropdown */}
              {showSuggestions && (
              <ul
              className="absolute left-0 top-full w-full bg-white border border-gray-3 rounded-b shadow-lg max-h-60 overflow-y-auto z-[40000]"
              style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              }}
              >
              {loadingSuggestions ? (
              <li className="px-4 py-2 text-gray-500">Chargement...</li>
              ) : suggestions.length === 0 ? (
              <li className="px-4 py-2 text-gray-400">Aucune suggestion</li>
              ) : (
              suggestions.map((suggestion, idx) => (
              <li
              key={idx}
              className="px-4 py-2 cursor-pointer hover:bg-gray-2"
              onMouseDown={() => handleSuggestionClick(suggestion)}
              >
              {suggestion.image && (
              <img
              src={`/${suggestion.image}`}
              alt={suggestion.name}
              className="w-10 h-10 object-cover rounded"
              style={{ minWidth: 40, minHeight: 40 }}
              />
              )}
              {suggestion.name || "Produit sans nom"}
              </li>
              ))
              )}
              </ul>
              )}
              <button
              id="search-btn"
              aria-label="Search"
              className="flex items-center justify-center px-3 h-10 text-blue hover:text-blue-700"
              type="submit"
              >
              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" fill="#ff4500"/></svg>
              </button>
            </form>
          </div>
        </div>
        {/* Right controls: user, panier, hamburger */}
        <div className="flex items-center gap-2 xl:gap-8 pr-1 xl:pr-0 min-w-0 overflow-visible mt-1 xl:mt-2">
          {/* Account & Cart */}
          <Link href="/signin" className="flex items-center gap-2.5 px-2 py-1 hover:bg-gray-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z" fill="#ff4500"/><path fillRule="evenodd" clipRule="evenodd" d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25ZM4.75001 17.5C4.75001 16.6487 5.37139 15.7251 6.71085 14.9717C8.02681 14.2315 9.89529 13.75 12 13.75C14.1047 13.75 15.9732 14.2315 17.2892 14.9717C18.6286 15.7251 19.25 16.6487 19.25 17.5C19.25 18.8078 19.2097 19.544 18.5264 20.1004C18.1559 20.4022 17.5365 20.6967 16.4762 20.9113C15.4193 21.1252 13.9742 21.25 12 21.25C10.0258 21.25 8.58075 21.1252 7.5238 20.9113C6.46354 20.6967 5.84413 20.4022 5.4736 20.1004C4.79033 19.544 4.75001 18.8078 4.75001 17.5Z" fill="#ff4500"/></svg>
            <div>
              <span className="block text-2xs text-dark-4 uppercase">compte</span>
              <p className="font-bold text-custom-sm text-dark">Se connecter</p>
            </div>
          </Link>
          <button onClick={openCartModal} className="flex items-center gap-2.5 px-2 py-1 hover:bg-gray-2 rounded-md relative">
            <span className="inline-block relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z" fill="#ff4500"/><path fillRule="evenodd" clipRule="evenodd" d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z" fill="#ff4500"/><path fillRule="evenodd" clipRule="evenodd" d="M5.2502 19.5C5.2502 20.7426 6.25756 21.75 7.5002 21.75C8.74285 21.75 9.7502 20.7426 9.7502 19.5C9.7502 18.2573 8.74285 17.25 7.5002 17.25C6.25756 17.25 5.2502 18.2573 5.2502 19.5ZM7.5002 20.25C7.08599 20.25 6.7502 19.9142 6.7502 19.5C6.7502 19.0857 7.08599 18.75 7.5002 18.75C7.91442 18.75 8.2502 19.0857 8.2502 19.5C8.2502 19.9142 7.91442 20.25 7.5002 20.25Z" fill="#ff4500"/><path fillRule="evenodd" clipRule="evenodd" d="M14.25 19.5001C14.25 20.7427 15.2574 21.7501 16.5 21.7501C17.7426 21.7501 18.75 20.7427 18.75 19.5001C18.75 18.2574 17.7426 17.2501 16.5 17.2501C15.2574 17.2501 14.25 18.2574 14.25 19.5001ZM16.5 20.2501C16.0858 20.2501 15.75 19.9143 15.75 19.5001C15.75 19.0859 16.0858 18.7501 16.5 18.7501C16.9142 18.7501 17.25 19.0859 17.25 19.5001C17.25 19.9143 16.9142 20.2501 16.5 20.2501Z" fill="#ff4500"/></svg>
              <span
                className="flex items-center justify-center font-bold text-2xs absolute -right-2 -top-1.5 bg-[#ff4500] w-4 h-4 rounded-full text-white"
                style={{ fontSize: '0.7rem', minWidth: '1rem', minHeight: '1rem', top: '0.5rem' }}
              >
                {product.length}
              </span>
              <div>
                <span className="block text-2xs text-dark-4 uppercase">Panier</span>
                <p className="font-bold text-custom-sm text-dark">{Number(totalPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</p>
              </div>
            </span>
          </button>
          {/* Hamburger menu button (mobile only) */}
          <button
            id="Toggle"
            aria-label="Toggler"
            className="block xl:hidden ml-2 z-[10002]"
            style={{ minWidth: 40, minHeight: 40 }}
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="block relative cursor-pointer w-7 h-7">
              <span className="du-block absolute right-0 w-full h-full">
                <span className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${!navigationOpen && "!w-full delay-300"}`}></span>
                <span className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${!navigationOpen && "!w-full delay-400"}`}></span>
                <span className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${!navigationOpen && "!w-full delay-500"}`}></span>
              </span>
              <span className="block absolute right-0 w-full h-full rotate-45">
                <span className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${!navigationOpen && "!h-0 delay-[0] "}`}></span>
                <span className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${!navigationOpen && "!h-0 dealy-200"}`}></span>
              </span>
            </span>
          </button>
        </div>
      </div>
            {/* Desktop/Tablet Navigation (hidden on mobile) */}
      <div className={`border-t border-gray-3 bg-white sticky top-0 z-[9998] transition-transform duration-300 ease-in-out hidden xl:block ${hideTopHeader ? "-translate-y-full" : "translate-y-0"}`} style={{ boxShadow: stickyMenu ? '0 2px 8px rgba(0,0,0,0.04)' : undefined, willChange: 'transform', minHeight: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, width: '100%', overflow: 'visible'}}>
        <div className="flex items-center justify-center w-full px-4 sm:px-7.5 xl:px-0">
          <div className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between header-mobile-nav`} style={{ zIndex: 12000, background: 'white', overflow: 'visible' }}>
            <nav>
              <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
              {menuData.map((menuItem, i) => menuItem.submenu ? (
  menuItem.title === "Boutique" ? (
    <Dropdown
      key={`static-${i}`}
      menuItem={menuItem}
      stickyMenu={stickyMenu}
      categories={categories}
      loadingCategories={loadingCategories}
    />
  ) : (
    <Dropdown key={`static-${i}`} menuItem={menuItem} stickyMenu={stickyMenu} />
  )
) : (
  <li key={`static-${i}`} className="group relative before:w-0 before:h-[3px] before:bg-[#ff4500] before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ">
    {menuItem.path && (
      <Link href={menuItem.path as string} className={`hover:text-blue text-base xl:text-lg font-medium text-dark flex items-center justify-center px-4 xl:px-7 ${stickyMenu ? "xl:py-4" : "xl:py-5"} transition-all duration-150 relative`}>{menuItem.title}{menuItem.showBadge && (
        <span
          className="intense-flashing-badge px-1 py-0.5 text-[0.60rem] leading-none font-bold bg-[#FF4500] text-white rounded absolute top-1 -right-3 shadow-md border border-white z-10 animate-pulse"
          style={{ minWidth: '1.2rem', minHeight: '1rem', boxShadow: '0 2px 8px rgba(255,69,0,0.18)' }}
        >
          Limitée!
        </span>
      )}</Link>
    )}
  </li>
))}
              </ul>
            </nav>
          </div>
          <div className="hidden xl:block"><ul className="flex items-center gap-5.5"></ul></div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;