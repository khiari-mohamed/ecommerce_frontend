import React from "react";
import { Testimonial } from "@/types/testimonial";

function stringToColor(str: string) {
  // Simple hash to color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  const firstLetter = testimonial.authorName?.charAt(0).toUpperCase() || "?";
  const bgColor = stringToColor(testimonial.authorName || "A");
  const stars = Number(testimonial.stars) || 5;

  return (
    <div className="shadow-testimonial bg-white rounded-xl py-6 px-4 sm:px-7 m-1 flex flex-col gap-4">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(stars)].map((_, i) => (
          <img
            key={i}
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={15}
            height={15}
            loading="lazy"
            style={{ display: "inline-block" }}
          />
        ))}
      </div>
      <p className="text-dark text-base mb-2">{testimonial.review}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ background: bgColor }}
        >
          {firstLetter}
        </div>
        <div>
          <h3 className="font-medium text-dark text-base">{testimonial.authorName}</h3>
          <p className="text-custom-sm text-gray-500">{testimonial.authorRole}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
