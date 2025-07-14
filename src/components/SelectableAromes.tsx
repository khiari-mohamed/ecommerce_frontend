"use client";
import React, { useState } from "react";

interface SelectableAromesProps {
  aromes: string[];
}

const SelectableAromes: React.FC<SelectableAromesProps> = ({ aromes }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleArome = (arome: string) => {
    setSelected((prev) =>
      prev.includes(arome)
        ? prev.filter((a) => a !== arome)
        : [...prev, arome]
    );
  };

  return (
    <div className="mb-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-2">Arômes</h3>
      <ul className="flex flex-wrap gap-2">
        {aromes.map((arome) => (
          <li key={arome}>
            <button
              type="button"
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 focus:outline-none ${
                selected.includes(arome)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100 hover:border-blue-400"
              }`}
              onClick={() => toggleArome(arome)}
            >
              {arome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectableAromes;
