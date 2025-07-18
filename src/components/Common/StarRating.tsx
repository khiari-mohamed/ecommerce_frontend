import React from "react";

interface StarRatingProps {
  rating: number; // average rating, e.g. 3.5
  max?: number;   // max stars, default 5
  size?: number;  // px size, default 16
  className?: string;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 16,
  className = "",
  editable = false,
  onChange,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  // SVGs for full, half, and empty stars
  const fullStar = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="#FBBF24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z"/>
    </svg>
  );
  const halfStar = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="half-grad">
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      <path
        d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z"
        fill="url(#half-grad)"
      />
    </svg>
  );
  const emptyStar = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="#E5E7EB"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z"/>
    </svg>
  );

  // For editable mode, show all empty stars and fill up to the selected rating
  if (editable) {
    return (
      <span className={`flex items-center gap-0.5 ${className}`}>
        {[...Array(max)].map((_, i) => (
          <span
            key={i}
            style={{ cursor: "pointer" }}
            onClick={() => onChange && onChange(i + 1)}
            data-testid={`star-editable-${i}`}
          >
            {i < rating ? fullStar : emptyStar}
          </span>
        ))}
      </span>
    );
  }

  // Read-only mode (original logic)
  return (
    <span className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>{fullStar}</span>
      ))}
      {hasHalfStar && <span key="half">{halfStar}</span>}
    </span>
  );
};

export default StarRating;