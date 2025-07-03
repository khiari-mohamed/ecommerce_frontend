import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
};

export default function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  fallback,
  className = "",
}: AvatarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600 ${sizeMap[size]} ${className}`}
      aria-label={alt}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100%"
          className="object-cover w-full h-full"
          onError={fallback ? (e) => { (e.target as HTMLImageElement).src = fallback; } : undefined}
          priority={false}
        />
      ) : (
        <span className="text-gray-500 dark:text-gray-300 font-semibold">
          {alt?.[0] || "?"}
        </span>
      )}
    </span>
  );
}