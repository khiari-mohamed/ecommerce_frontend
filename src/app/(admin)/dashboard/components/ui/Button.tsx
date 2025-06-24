import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  outline: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeMap = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${variantMap[variant]} ${sizeMap[size]} ${className} ${loading || disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 mr-1 text-current" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}