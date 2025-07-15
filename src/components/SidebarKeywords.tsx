"use client";
import React, { useEffect, useState } from "react";

interface KeywordDoc {
  keyword: string;
  product_ids: string[];
  category_ids: string[];
  subcategory_ids: string[];
}

interface SidebarKeywordsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SidebarKeywords: React.FC<SidebarKeywordsProps> = ({ value, onChange }) => {
  const [keywords, setKeywords] = useState<KeywordDoc[]>([]);

  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then(setKeywords);
  }, []);

  const toggleKeyword = (kw: string) => {
    if (value.includes(kw)) {
      onChange(value.filter((k) => k !== kw));
    } else {
      onChange([...value, kw]);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 mb-2">Mots clés</h3>
      <ul className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <li key={kw.keyword}>
            <button
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 focus:outline-none ${
                value.includes(kw.keyword)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
              style={{
                ...(value.includes(kw.keyword)
                  ? {}
                  : { transition: "background 0.2s, border 0.2s, color 0.2s" }),
              }}
              onMouseEnter={e => {
                if (!value.includes(kw.keyword)) {
                  e.currentTarget.style.background = "#FF4301";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#FF4301";
                }
              }}
              onMouseLeave={e => {
                if (!value.includes(kw.keyword)) {
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
    </div>
  );
};

export default SidebarKeywords;