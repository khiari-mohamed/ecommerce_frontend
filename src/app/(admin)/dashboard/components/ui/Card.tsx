import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  glass?: boolean;
  border?: boolean;
  as?: React.ElementType;
}

export default function Card({
  children,
  className = "",
  shadow = true,
  glass = true,
  border = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={`
        ${glass ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg" : "bg-white dark:bg-gray-900"}
        ${shadow ? "shadow-xl hover:shadow-2xl transition-shadow" : ""}
        ${border ? "border border-gray-200 dark:border-gray-800" : ""}
        rounded-2xl p-6 ${className}
      `}
    >
      {children}
    </Tag>
  );
}