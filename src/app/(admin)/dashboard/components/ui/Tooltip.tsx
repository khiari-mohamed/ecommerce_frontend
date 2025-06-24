import React, { useRef, useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Positioning logic (basic)
  const posClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={ref}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby="tooltip"
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 px-3 py-2 rounded-lg shadow-lg bg-gray-900 text-white text-xs font-semibold pointer-events-none transition-opacity duration-150 opacity-100 ${posClass}`}
          role="tooltip"
          id="tooltip"
        >
          {content}
          <span className="absolute w-2 h-2 bg-gray-900 rotate-45" style={{
            [position === "top" ? "bottom" : position === "bottom" ? "top" : position === "left" ? "right" : "left"]: "-4px",
            [position === "top" || position === "bottom" ? "left" : "top"]: "50%",
            transform: "translate(-50%, -50%)",
          }} />
        </div>
      )}
    </div>
  );
}