import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export default function Dropdown({
  label,
  children,
  className = "",
  align = "left",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={ref}>
      <button
        type="button"
        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={`ml-1 transition-transform ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[10rem] rounded-xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 py-2
            ${align === "right" ? "right-0" : "left-0"}
            animate-fade-in
          `}
          tabIndex={-1}
        >
          {children}
        </div>
      )}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInDropdown 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-8px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}