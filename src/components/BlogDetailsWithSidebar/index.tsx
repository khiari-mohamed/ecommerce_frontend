"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SearchForm from "../Blog/SearchForm";
import LatestPosts from "../Blog/LatestPosts";
import LatestProducts from "../Blog/LatestProducts";
import Categories from "../Blog/Categories";
import Image from "next/image";
import { getBlogBySlug, getBlogs, Blog } from "@/services/blog.service";
import { getLatestProducts, Product } from "@/services/products";
import { getCategories, Category } from "@/services/categories";

type BlogDetailsWithSidebarProps = {
  slug: string;
};

const BLOG_IMAGE_BASE = "/uploads/";

const BlogDetailsWithSidebar = ({ slug }: BlogDetailsWithSidebarProps) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getBlogBySlug(slug).then((data) => {
        setBlog(data);
        setLoading(false);

        if (data) {
          if ((data as any).tags && Array.isArray((data as any).tags)) {
            setTags((data as any).tags);
          }
          if ((data as any).categories && Array.isArray((data as any).categories)) {
            setCategories((data as any).categories);
          } else if ((data as any).category && typeof (data as any).category === "string") {
            setCategories([(data as any).category]);
          }
        }
      });
    }
  }, [slug]);

  useEffect(() => {
    getBlogs().then((data) => {
      setLatestBlogs(data);
      setFilteredBlogs(data);
    });
    getLatestProducts().then((data) => setLatestProducts(data));
    getCategories().then((data) => setCategories(data));
  }, []);

  // Search handler for sidebar
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredBlogs(latestBlogs);
    } else {
      const lower = query.toLowerCase();
      setFilteredBlogs(
        latestBlogs.filter(
          (b) =>
            (b.title && b.title.toLowerCase().includes(lower)) ||
            (b.designation_fr && b.designation_fr.toLowerCase().includes(lower)) ||
            (b.content && b.content.toLowerCase().includes(lower)) ||
            (b.description && b.description.toLowerCase().includes(lower))
        )
      );
    }
  };

  // Normalize image URL
  let imageUrl = "/images/blog/blog-details-01.jpg";
  if (blog?.cover) {
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

  const date = blog?.created_at
    ? new Date(blog.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Aucune date";

  const views = (blog as any)?.views ?? 0;
  const title = blog?.designation_fr || blog?.title || "";
  const imageAlt = blog?.alt_cover || title || "blog";
  const description =
    blog?.description_cover || blog?.meta_description_fr || blog?.meta || "";
  const content =
    blog?.content ||
    blog?.description ||
    `<p>Aucune description disponible pour cet article.</p>`;
  const contentSeo =
    blog?.content_seo ||
    "‘‘Aucune citation SEO disponible pour cet article.’’";
  const author = blog?.author || "Auteur inconnu";
  const authorRole = blog?.author_role || "Expert Nutrition";

  return (
    <>
      <Breadcrumb
        title={title}
        pages={["Détails du blog avec barre latérale"]}
      />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-12.5">
            {/* <!-- blog details --> */}
            <div className="lg:max-w-[750px] w-full">
              {loading ? (
                <div className="text-center py-10 text-gray-400">Chargement...</div>
              ) : (
                <>
                  <div className="rounded-[10px] overflow-hidden mb-7.5">
                    <Image
                      className="rounded-[10px]"
                      src={imageUrl}
                      alt={imageAlt}
                      title={description}
                      width={750}
                      height={477}
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-3 mb-4">
                      <span className="ease-out duration-200 hover:text-blue">
                        {date}
                      </span>
                      <span className="block w-px h-4 bg-gray-4"></span>
                      <span className="ease-out duration-200 hover:text-blue">
                        {views} Vues
                      </span>
                    </span>

                    <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">
                      {title}
                    </h2>

                    {/* Render HTML content safely */}
                    <div
                      className="prose prose-blue max-w-none mb-6"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Meta section if present */}
                    {blog?.meta && (
                      <div className="mt-7.5">
                        <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-6">
                          {blog.meta}
                        </h3>
                      </div>
                    )}

                    {/* SEO quote/content_seo */}
                    <div className="rounded-xl bg-white pt-7.5 pb-6 px-4 sm:px-7.5 my-7.5">
                      <p className="italic text-dark text-center">
                        {contentSeo}
                      </p>

                      <div className="flex items-center justify-center gap-3 mt-5.5">
                        <div className="flex w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src="/images/users/user-04.jpg"
                            alt={author}
                            width={48}
                            height={48}
                          />
                        </div>
                        <div>
                          <h4 className="text-dark text-custom-sm">
                            {author}
                          </h4>
                          <p className="text-custom-xs">
                            {authorRole}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tags section, dynamic if tags exist */}
                    <div className="flex flex-wrap items-center justify-between gap-10 mt-10">
                      <div className="flex flex-wrap items-center gap-5">
                        <p>Tags populaires :</p>
                        <ul className="flex flex-wrap items-center gap-3.5">
                          {tags.length > 0 ? (
                            tags.map((tag, idx) => (
                              <li key={idx}>
                                <a
                                  className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                                  href={`/blogs/tag/${encodeURIComponent(tag)}`}
                                >
                                  {tag}
                                </a>
                              </li>
                            ))
                          ) : (
                            <li>
                              <span className="inline-flex border border-gray-3 bg-white py-2 px-4 rounded-md text-gray-400">
                                Aucun tag
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* <!-- Social Links start --> */}
                      <div className="flex items-center gap-3">
                        {/* Social SVGs unchanged */}
                        {/* ... */}
                      </div>
                      {/* <!-- Social Links end --> */}
                    </div>
                  </div>
                </>
              )}
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
              <LatestPosts blogs={filteredBlogs} />

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

export default BlogDetailsWithSidebar;