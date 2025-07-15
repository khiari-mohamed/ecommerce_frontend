"use client";
import React from "react";

interface Aroma {
  _id?: string;
  id?: string;
  designation_fr: string;
}

interface SidebarAromeDropdownProps {
  aromas: Aroma[];
  value: string;
  onChange: (value: string) => void;
}

const SidebarAromeDropdown: React.FC<SidebarAromeDropdownProps> = ({ aromas, value, onChange }) => {
  return (
    <div className="mb-4 border-b border-gray-200 w-full max-w-full px-0 sm:px-1 overflow-x-auto">
      <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm md:text-base">
        Arômes
      </h3>
      <div className="w-full min-w-0">
        <select
          id="arome-select"
          className="block w-full max-w-full min-w-0 px-1 py-0.5 rounded border border-gray-300 bg-white text-gray-900 text-xs sm:text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Arômes"
        >
          <option value="">Tous les arômes</option>
          {aromas.map((arome) => (
            <option key={arome._id || arome.id} value={arome.id}>
              {arome.designation_fr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SidebarAromeDropdown;
