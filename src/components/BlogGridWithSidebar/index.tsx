"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import BlogItem from "../Blog/BlogItem";
import { useBlogData } from "../BlogGrid/blogData";
import SearchForm from "../Blog/SearchForm";
import LatestPosts from "../Blog/LatestPosts";
import LatestProducts from "../Blog/LatestProducts";
import Categories from "../Blog/Categories";
import { getLatestProducts, Product } from "@/services/products";
import { getBlogs } from "@/services/blog.service";

const BlogGridWithSidebar = () => {
  const allBlogs = useBlogData();

  // Dynamic products for sidebar
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  // Dynamic categories/tags (if available from API or blog data)
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState(allBlogs);

  useEffect(() => {
    getLatestProducts().then((data) => setLatestProducts(data));
    getBlogs().then((blogs) => {
      const cats: Record<string, any> = {};
      const tagSet = new Set<string>();
      blogs.forEach((blog: any) => {
        if (blog.categories && Array.isArray(blog.categories)) {
          blog.categories.forEach((cat: any) => {
            if (cat && cat.slug) cats[cat.slug] = cat;
            else if (typeof cat === "string") cats[cat] = { designation: cat, slug: cat, products: [] };
          });
        } else if (blog.category && typeof blog.category === "string") {
          cats[blog.category] = { designation: blog.category, slug: blog.category, products: [] };
        }
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });
      setCategories(Object.values(cats));
      setTags(Array.from(tagSet));
    });
  }, []);

  // Update filteredBlogs when allBlogs or searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBlogs(allBlogs);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredBlogs(
        allBlogs.filter(
          (b) =>
            (b.title && b.title.toLowerCase().includes(lower)) ||
            (b.designation_fr && b.designation_fr.toLowerCase().includes(lower)) ||
            (b.content && b.content.toLowerCase().includes(lower)) ||
            (b.description && b.description.toLowerCase().includes(lower))
        )
      );
    }
  }, [allBlogs, searchQuery]);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Breadcrumb title={"Grille de blogs avec barre latérale"} pages={["grille de blogs"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5">
            {/* <!-- blog grid --> */}
            <div className="lg:max-w-[770px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-7.5">
                {filteredBlogs.length === 0 ? (
                  <div>Aucun article trouvé.</div>
                ) : (
                  filteredBlogs.map((blog, key) => (
                    <BlogItem blog={blog} key={key} />
                  ))
                )}
              </div>

              {/* <!-- Blog Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="bouton pour pagination gauche"
                        type="button"
                        disabled
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px disabled:text-gray-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] bg-blue text-white hover:text-white hover:bg-blue"
                      >
                        1
                      </a>
                    </li>
                    {/* ...other pagination items unchanged... */}
                  </ul>
                </div>
              </div>
              {/* <!-- Blog Pagination End --> */}
            </div>

            {/* <!-- blog sidebar --> */}
            <div className="lg:max-w-[370px] w-full">
              {/* <!-- search box --> */}
              <SearchForm
                onSearch={handleSearch}
                placeholder="Rechercher un article..."
                label="Recherche"
              />

              {/* <!-- Recent Posts box --> */}
              <LatestPosts blogs={filteredBlogs.slice(0, 3)} />

              {/* <!-- Latest Products box --> */}
              <LatestProducts products={latestProducts} />

              {/* <!-- Popular Category box --> */}
              <Categories categories={categories} />

              {/* <!-- Tags box --> */}
              <div className="shadow-1 bg-white rounded-xl mt-7.5">
                <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
                  <h2 className="font-medium text-lg text-dark">Tags</h2>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-3.5">
                    {tags.length > 0 ? (
                      tags.map((tag, idx) => (
                        <a
                          key={idx}
                          className="inline-flex hover:text-white border border-gray-3 py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                          href={`/blogs/tag/${encodeURIComponent(tag)}`}
                        >
                          {tag}
                        </a>
                      ))
                    ) : (
                      <span className="text-gray-400">Aucun tag</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogGridWithSidebar;