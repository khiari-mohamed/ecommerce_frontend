import Link from "next/link";
import React from "react";
import Image from "next/image";
import type { Blog } from "@/services/blog.service";

const BLOG_IMAGE_BASE = "/uploads/"; // Adjust if your CDN/static path is different

const LatestPosts = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Articles récents</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* <!-- post item --> */}
          {blogs.slice(0, 3).map((blog) => {
            // Normalize image URL
            let imageUrl = "";
            if (blog.cover) {
              if (typeof blog.cover === "string") {
                imageUrl = blog.cover.startsWith("http")
                  ? blog.cover
                  : BLOG_IMAGE_BASE + blog.cover.replace(/^\/+/, "");
              } else if (blog.cover.url) {
                imageUrl = blog.cover.url.startsWith("http")
                  ? blog.cover.url
                  : BLOG_IMAGE_BASE + blog.cover.url.replace(/^\/+/, "");
              }
            }
            if (!imageUrl) {
              imageUrl = "/images/blog/blog-01.jpg"; // fallback image
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
              : "Aucune date";

            // Use views if present, else fallback to 0
            const views = (blog as any).views ?? 0;

            // Use designation_fr as title, fallback to title
            const title = blog.designation_fr || blog.title || "";

            // Use alt_cover for image alt if present, else fallback to title or "blog"
            const imageAlt =
              blog.alt_cover ||
              title ||
              "blog";

            return (
              <div className="flex items-center gap-4" key={blog._id}>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="max-w-[110px] w-full rounded-[10px] overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    className="rounded-[10px] w-full"
                    width={110}
                    height={80}
                  />
                </Link>

                <div>
                  <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 hover:text-blue">
                    <Link href={`/blogs/${blog.slug}`}>{title}</Link>
                  </h3>

                  <span className="flex items-center gap-3">
                    <span className="text-custom-xs ease-out duration-200 hover:text-blue">
                      {date}
                    </span>
                    {/* <!-- divider --> */}
                    <span className="block w-px h-4 bg-gray-4"></span>
                    <span className="text-custom-xs ease-out duration-200 hover:text-blue">
                      {views} Vues
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestPosts;