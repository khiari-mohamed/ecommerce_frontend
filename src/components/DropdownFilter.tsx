"use client";
import React, { useState, ReactNode } from "react";

interface DropdownFilterProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="w-full flex items-center justify-between py-2 font-semibold text-gray-700 focus:outline-none hover:text-blue-600 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
};

export default DropdownFilter;
