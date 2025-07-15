"use client";
import React, { useState } from "react";

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
    <div className="mb-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-2 text-base sm:text-sm">Arômes</h3>
      <div className="w-full min-w-0">
        <select
          id="arome-select"
          className="block w-full min-w-0 px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 text-sm sm:text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
