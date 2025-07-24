import React from "react";
import type { Blog } from "@/services/blog.service";
import Image from "next/image";
import Link from "next/link";

const BLOG_IMAGE_BASE = "/uploads/";

const BlogItem = ({ blog }: { blog: Blog }) => {
  // Determine image URL from blog.cover (string or object)
  let imageUrl = "";

  if (blog.cover) {
    if (typeof blog.cover === "string") {
      // Remove any leading slashes
      const cleanCover = blog.cover.replace(/^\/+/, "");
      imageUrl = blog.cover.startsWith("http")
        ? blog.cover
        : BLOG_IMAGE_BASE + cleanCover;
    } else if (blog.cover.url) {
      const cleanCoverUrl = blog.cover.url.replace(/^\/+/, "");
      imageUrl = blog.cover.url.startsWith("http")
        ? blog.cover.url
        : BLOG_IMAGE_BASE + cleanCoverUrl;
    }
  }

  // Fallback image if none provided
  if (!imageUrl) {
    imageUrl = "/images/blog/blog-01.jpg";
  }

  // Debug: log the cover and the final imageUrl
  if (typeof window !== "undefined") {
    console.log("Blog cover:", blog.cover, "Image URL:", imageUrl);
  }

  // Format date from created_at or createdAt
  const date = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date";

  const views = (blog as any).views ?? 0;
  const title = blog.designation_fr || blog.title || "";
  const imageAlt = blog.alt_cover || title || "blog";
  const description =
    blog.description_cover || blog.meta_description_fr || blog.meta || "";

  return (
    <div className="shadow-1 bg-white rounded-xl px-4 sm:px-5 pt-5 pb-4 blog-card-fixed-height">
      <Link href={`/blogs/${blog.slug}`} className="rounded-md overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          title={description}
          className="rounded-md w-full"
          width={330}
          height={210}
        />
      </Link>
      <div className="mt-5.5 flex flex-col h-full">
        <span className="flex items-center gap-3 mb-2.5">
          <span className="text-custom-sm ease-out duration-200 hover:text-blue">
            {date}
          </span>
          <span className="block w-px h-4 bg-gray-4"></span>
          <span className="text-custom-sm ease-out duration-200 hover:text-blue">
            {views} Views
          </span>
        </span>
        <h2 className="font-medium text-dark text-lg sm:text-xl ease-out duration-200 mb-4 hover:text-blue blog-title-ellipsis">
          <Link href={`/blogs/${blog.slug}`}>{title}</Link>
        </h2>
        <Link
          href={`/blogs/${blog.slug}`}
          className="text-custom-sm inline-flex items-center gap-2 py-2 ease-out duration-200 hover:text-blue mt-auto"
        >
          En savoir plus
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.1023 4.10225C10.3219 3.88258 10.6781 3.88258 10.8977 4.10225L15.3977 8.60225C15.6174 8.82192 15.6174 9.17808 15.3977 9.39775L10.8977 13.8977C10.6781 14.1174 10.3219 14.1174 10.1023 13.8977C9.88258 13.6781 9.88258 13.3219 10.1023 13.1023L13.642 9.5625H3C2.68934 9.5625 2.4375 9.31066 2.4375 9C2.4375 8.68934 2.68934 8.4375 3 8.4375H13.642L10.1023 4.89775C9.88258 4.67808 9.88258 4.32192 10.1023 4.10225Z"
              fill=""
            />
          </svg>
        </Link>
      </div>
      <style jsx>{`
        .blog-card-fixed-height {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 410px;
          max-height: 430px;
        }
        .blog-title-ellipsis {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          min-height: 2.7em;
        }
        @media (max-width: 900px) {
          .blog-card-fixed-height {
            min-height: 370px;
            max-height: 390px;
          }
        }
        @media (max-width: 640px) {
          .blog-card-fixed-height {
            min-height: 320px;
            max-height: 340px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogItem;