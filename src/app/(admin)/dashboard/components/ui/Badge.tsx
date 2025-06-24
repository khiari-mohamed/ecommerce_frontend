import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: "gray" | "blue" | "green" | "red" | "yellow" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap = {
  gray: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
  green: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
  red: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export default function Badge({
  children,
  color = "gray",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full font-semibold ${colorMap[color]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </span>
  );
}