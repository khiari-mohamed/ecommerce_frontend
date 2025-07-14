"use client";
import React, { useEffect, useState } from "react";
import DropdownFilter from "./DropdownFilter";

interface KeywordDoc {
  keyword: string;
  product_ids: string[];
  category_ids: string[];
  subcategory_ids: string[];
}

const SidebarKeywords: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordDoc[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then(setKeywords);
  }, []);

  const toggleKeyword = (kw: string) =>
    setSelected((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );

  return (
    <DropdownFilter title="Mots clés">
      <ul className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <li key={kw.keyword}>
            <button
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 focus:outline-none ${
                selected.includes(kw.keyword)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
              style={{
                ...(selected.includes(kw.keyword)
                  ? {}
                  : { transition: "background 0.2s, border 0.2s, color 0.2s" }),
              }}
              onMouseEnter={e => {
                if (!selected.includes(kw.keyword)) {
                  e.currentTarget.style.background = "#FF4301";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#FF4301";
                }
              }}
              onMouseLeave={e => {
                if (!selected.includes(kw.keyword)) {
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.borderColor = "";
                }
              }}
              onClick={() => toggleKeyword(kw.keyword)}
            >
              {kw.keyword}
            </button>
          </li>
        ))}
      </ul>
    </DropdownFilter>
  );
};

export default SidebarKeywords;