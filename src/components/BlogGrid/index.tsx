"use client";
import React, { useState, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useBlogData } from "./blogData";
import BlogItem from "../Blog/BlogItem";

const BlogGrid = () => {
  const blogData = useBlogData();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const { currentBlogs, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return {
      currentBlogs: blogData.slice(startIndex, endIndex),
      totalPages: Math.ceil(blogData.length / blogsPerPage),
    };
  }, [blogData, currentPage]);

  return (
    <div className="blog-page overflow-x-hidden"> {/* 🚑 Prevent horizontal scroll */}
      <Breadcrumb title={"Blog Grid"} pages={["blog grid"]} />
      <section className="pt-4 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog, key) => (
              <BlogItem blog={blog} key={key} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16"> {/* fixed mt-15 → mt-16 */}
              <div className="bg-white shadow rounded-md p-2">
                <ul className="flex flex-wrap items-center gap-1">
                  {/* Previous Button */}
                  <li>
                    <button
                      aria-label="button for pagination left"
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-8 h-9 rounded disabled:text-gray-400 hover:text-white hover:bg-blue transition"
                    >
                      ◀
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`flex py-1 px-3 rounded transition ${
                          currentPage === page
                            ? "bg-blue text-white"
                            : "hover:bg-blue hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next Button */}
                  <li>
                    <button
                      aria-label="button for pagination right"
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-8 h-9 rounded hover:text-white hover:bg-blue disabled:text-gray-400 transition"
                    >
                      ▶
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogGrid;
