import { useState, useRef, useEffect, RefObject } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

interface DropdownProps {
  menuItem: any;
  stickyMenu: boolean;
  categories?: Category[];
  loadingCategories?: boolean;
}

const Dropdown = ({ menuItem, stickyMenu, categories = [], loadingCategories = false }: DropdownProps) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const pathUrl = usePathname();
  // Use correct ref type for each dropdown variant
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on scroll or click outside (mobile only)
  useEffect(() => {
    if (!dropdownToggler) return;
    const handleScroll = () => setDropdownToggler(false);
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownToggler(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [dropdownToggler]);

  // Desktop hover handlers with delay
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1280) {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setDesktopOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 1280) {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => setDesktopOpen(false), 200);
    }
  };

  // Mega menu for "Boutique"
  const isBoutique = menuItem.title === "Boutique";

  return (
    <li
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        pathUrl && pathUrl.includes(menuItem.title) && "before:!w-full"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="#"
        className={`hover:text-blue text-base xl:text-lg font-medium text-dark flex items-center justify-center px-4 xl:px-7 ${stickyMenu ? "xl:py-4" : "xl:py-5"} transition-all duration-150 ${pathUrl && pathUrl.includes(menuItem.title) ? "!text-blue" : ""}`}
        onClick={e => { e.preventDefault(); setDropdownToggler(!dropdownToggler); }}
      >
        {menuItem.title}
        <svg
          className="fill-current cursor-pointer"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
            fill=""
          />
        </svg>
      </a>

      {/* Mega Menu for Boutique */}
      {isBoutique ? (
        <div
          ref={megaMenuRef}
          className={`fixed left-0 top-0 w-screen h-screen z-[99999] bg-white bg-opacity-95 transition-all duration-300 ease-in-out xl:flex hidden ${desktopOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)', overflowY: 'auto' }}
        >
          <div
            className="w-full max-w-[1300px] mx-auto grid grid-cols-7 gap-4 py-12 px-4"
            style={{ alignItems: 'flex-start' }}
          >
            {/* Render categories as columns */}
            {loadingCategories ? (
              <div className="text-gray-500">Chargement...</div>
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat._id} className="min-w-[180px] max-w-[220px] mr-8">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="font-bold text-base mb-2 block transition-colors"
                    style={{ color: '#FF4500' }}
                  >
                    <span className="group/category block px-1 py-1 rounded cursor-pointer transition-colors hover:bg-[#FFF1E6]" style={{ color: '#FF4500' }}>
                      {cat.designation_fr || cat.name}
                    </span>
                  </Link>
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <ul className="pl-0">
                      {cat.subCategories.map((subcat) => (
                        <li key={subcat._id} className="py-1 px-2 cursor-pointer hover:bg-[#FF4500] hover:text-white text-sm text-gray-700 rounded transition">
                          <Link href={`/subcategories/${subcat.slug}`}>{subcat.designation_fr || subcat.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : null}
            {/* Last column: static links from menuItem.submenu */}
            <div className="min-w-[220px] max-w-[260px]">
              <Link
                href={menuItem.path || "/shop-with-sidebar"}
                className="font-bold text-base mb-2 block transition-colors"
                style={{ color: '#FF4500' }}
              >
                <span className="group/category block px-1 py-1 rounded cursor-pointer transition-colors hover:bg-[#FFF1E6]" style={{ color: '#FF4500' }}>
                  Boutique
                </span>
              </Link>
              <ul className="pl-0">
                {menuItem.submenu && menuItem.submenu
                .filter((item) => item.path !== "/shop-with-sidebar")
                .map((item, i) => (
                <li key={i} className="py-1 px-2 cursor-pointer hover:bg-[#FF4500] hover:text-white text-sm text-gray-700 rounded transition">
                <Link href={item.path}>{item.title}</Link>
                </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Default dropdown for other menu items
        <ul
          ref={dropdownRef}
          className={`dropdown w-full sm:w-[95vw] md:w-[420px] xl:w-[193px] 
            ${dropdownToggler ? 'flex max-h-[350px] overflow-y-auto opacity-100 translate-y-0 xl:hidden' : 'hidden opacity-0 -translate-y-2'}
            ${desktopOpen ? 'xl:flex xl:opacity-100 xl:translate-y-0' : 'xl:hidden xl:opacity-0 xl:-translate-y-2'}
            xl:absolute xl:left-0 xl:top-full xl:mt-2 xl:shadow-lg xl:rounded-md xl:min-w-[180px] xl:z-[10030]`}
          style={{ minWidth: '0' }}
        >
          {/* Mobile close button */}
          <button
            className="header-mobile-close xl:hidden absolute top-2 right-2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-2xl"
            aria-label="Fermer le menu"
            type="button"
            onClick={() => setDropdownToggler(false)}
          >
            &times;
          </button>
          {menuItem.submenu.map((item, i) => (
            <li key={i}>
              <Link
                href={item.path}
                className={`flex text-custom-sm hover:text-blue hover:bg-gray-1 py-[7px] px-4.5 ${
                  pathUrl && pathUrl === item.path && "text-blue bg-gray-1"
                } `}
                onClick={() => setDropdownToggler(false)}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
