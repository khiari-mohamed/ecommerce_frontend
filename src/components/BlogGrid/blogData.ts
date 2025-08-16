"use client";
import { useEffect, useState } from "react";
import { Blog } from "@/services/blog.service";
import { getBlogs } from "@/services/blog.service";

// Custom hook to fetch blog data dynamically
export function useBlogData(): Blog[] {
  const [blogData, setBlogData] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchData() {
      const blogs = await getBlogs();
      setBlogData(blogs);
    }
    fetchData();
  }, []);

  return blogData;
}
