"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "../../Blog/BlogItem";
import { getLandingPageBlogs, getBlogs } from "@/services/blog.service";

const CountdownBlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try landing page blogs first, fallback to all blogs if empty
    getLandingPageBlogs().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data.slice(0, 4));
        setLoading(false);
      } else {
        getBlogs().then((fallback) => {
          setBlogs(Array.isArray(fallback) ? fallback.slice(0, 4) : []);
          setLoading(false);
        });
      }
    });
  }, []);

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-10 text-center">Blog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-7.5">
          {loading ? (
            <div className="col-span-4 text-center py-10 text-gray-400">Chargement...</div>
          ) : blogs.length === 0 ? (
            <div className="col-span-4 text-center py-10 text-gray-400">Aucun blog à afficher.</div>
          ) : (
            blogs.map((blog, key) => <BlogItem blog={blog} key={key} />)
          )}
        </div>
      </div>
    </section>
  );
};

export default CountdownBlogGrid;