"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandNav {
  _id: string;
  slug: string;
  designation_fr: string;
  logo: string;
}

interface BrandsDropdownProps {
  brands: BrandNav[];
  loadingBrands: boolean;
  stickyMenu: boolean;
}

const BrandsDropdown: React.FC<BrandsDropdownProps> = ({ brands, loadingBrands, stickyMenu }) => {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize cursor-pointer ${stickyMenu ? "xl:py-4" : "xl:py-6"}`}
      >
        <svg className="w-5 h-5 mr-1 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 17l-4 4m0 0l-4-4m4 4V3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Marques
        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {/* Dropdown grid */}
      <div
        className={`dropdown absolute left-0 top-full mt-2 bg-white shadow-2xl rounded-xl min-w-[320px] z-50
          grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-gray-3
          transition-all duration-300 ease-in-out
          ${open ? "grid max-h-[350px] overflow-y-auto opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-2"}
        `}
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {loadingBrands ? (
          <div className="col-span-full text-center py-4 text-gray-400">Chargement...</div>
        ) : brands.length === 0 ? (
          <div className="col-span-full text-center py-4 text-gray-400">Aucune marque</div>
        ) : (
          brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand.slug}`}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-blue/10 transition group"
              onClick={() => setOpen(false)}
            >
              <Image
                src={`/images/brand/${brand.logo}`}
                alt={brand.designation_fr}
                width={60}
                height={60}
                className="object-contain rounded-full shadow-md border border-gray-200 bg-white grayscale group-hover:grayscale-0 group-hover:scale-110 transition"
              />
              <span className="text-xs font-semibold text-center text-dark group-hover:text-blue truncate w-20">{brand.designation_fr}</span>
            </Link>
          ))
        )}
      </div>
    </li>
  );
};

export default BrandsDropdown;
