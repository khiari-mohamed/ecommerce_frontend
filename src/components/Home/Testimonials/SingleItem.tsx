import React from "react";
import { Testimonial } from "@/types/testimonial";

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  const firstLetter = testimonial.authorName?.charAt(0).toUpperCase() || "?";
  const bgColor = stringToColor(testimonial.authorName || "A");
  const stars = Number(testimonial.stars) || 5;

  const percent = Math.min(Math.max((stars / 5) * 100, 0), 100);
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
  className="bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg rounded-2xl py-7 px-5 sm:px-8 flex flex-col gap-5 transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl"
  style={{ height: 360, minHeight: 360, width: "100%" }}
>

      <div className="flex items-center gap-3 mb-2">
        <svg height={radius * 2} width={radius * 2} className="block">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dy=".3em"
            fontSize="13"
            fill="#3b82f6"
            fontWeight="bold"
          >
            {stars}/5
          </text>
        </svg>

        <div className="flex items-center gap-1">
          {[...Array(stars)].map((_, i) => (
            <img
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star icon"
              width={17}
              height={17}
              loading="lazy"
              style={{ display: "inline-block" }}
            />
          ))}
        </div>
      </div>

      <p className="text-dark text-base mb-2 italic leading-relaxed line-clamp-4">
        {testimonial.review}
      </p>

      <div className="flex items-center gap-4 mt-auto">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white"
          style={{ background: bgColor }}
        >
          {firstLetter}
        </div>
        <div>
          <h3 className="font-semibold text-dark text-base leading-tight">{testimonial.authorName}</h3>
          <p className="text-custom-sm text-gray-500">{testimonial.authorRole}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
