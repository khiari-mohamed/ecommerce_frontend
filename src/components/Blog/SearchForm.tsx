
"use client";
// This component is a search form that allows users to input a search query.
import React, { useState } from "react";

interface SearchFormProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  label?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  placeholder = "Search here...",
  label = "Search",
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
    // Otherwise, do nothing for now (or you can add navigation/search logic here)
  };

  return (
    <div className="shadow-1 bg-white rounded-xl">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">{label}</h2>
      </div>

      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} role="search" aria-label={label}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="w-full rounded-md border border-gray-3 py-3 pl-5 pr-13 outline-none ease-out duration-200 placeholder:text-dark-5 focus:border-transparent focus:[box-shadow:0_0_0_2px_#ff6600] focus:ring-2 focus:ring-[#ff6600]/20"
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-dark-2 absolute right-0 top-0 px-4 py-3.5 ease-out duration-200 hover:text-[#ff6600]"
              aria-label="Submit search"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <g clipPath="url(#clip0_112_7367)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.58464 2.29163C5.55756 2.29163 2.29297 5.55622 2.29297 9.58329C2.29297 13.6104 5.55756 16.875 9.58464 16.875C13.6117 16.875 16.8763 13.6104 16.8763 9.58329C16.8763 5.55622 13.6117 2.29163 9.58464 2.29163ZM1.04297 9.58329C1.04297 4.86586 4.8672 1.04163 9.58464 1.04163C14.3021 1.04163 18.1263 4.86586 18.1263 9.58329C18.1263 11.7171 17.3439 13.6681 16.0504 15.1651L18.7766 17.8914C19.0207 18.1354 19.0207 18.5312 18.7766 18.7752C18.5325 19.0193 18.1368 19.0193 17.8927 18.7752L15.1665 16.049C13.6694 17.3426 11.7184 18.125 9.58464 18.125C4.8672 18.125 1.04297 14.3007 1.04297 9.58329Z"
                    fill=""
                    stroke=""
                    strokeLinecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_112_7367">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
