"use client";
import React, { useState } from "react";

interface Brand {
  _id?: string;
  id?: string;
  slug: string;
  designation_fr: string;
}

interface SidebarBrandDropdownProps {
  brands: Brand[];
  value: string;
  onChange: (value: string) => void;
}

const SidebarBrandDropdown: React.FC<SidebarBrandDropdownProps> = ({ brands, value, onChange }) => {
  return (
    <div className="mb-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-2 text-base sm:text-sm">Fabricants</h3>
      <div className="w-full min-w-0">
        <select
          id="brand-select"
          className="block w-full min-w-0 px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 text-sm sm:text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Fabricants"
        >
          <option value="">Tous les fabricants</option>
          {brands.map((brand) => (
            <option key={brand._id || brand.id} value={brand.id}>
              {brand.designation_fr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SidebarBrandDropdown;
