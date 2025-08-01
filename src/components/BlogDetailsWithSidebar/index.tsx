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

                    {/* Publication info and social icons */}
                    <div className="rounded-xl bg-white pt-7.5 pb-6 px-4 sm:px-7.5 my-7.5">
                      <div className="text-center mb-4">
                        <span className="block text-dark font-medium">publié par : Admin</span>
                        <span className="block text-dark">publié le : {date}</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-5.5">
                        {/* Facebook */}
                        <button
                          aria-label="Partager sur Facebook"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                        </button>
                        {/* Twitter */}
                        <button
                          aria-label="Partager sur Twitter"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                        </button>
                        {/* WhatsApp */}
                        <button
                          aria-label="Partager sur WhatsApp"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.451-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05.001C5.495.001.001 5.495 0 12.049c0 2.124.557 4.199 1.615 6.032L.057 23.944a1.001 1.001 0 0 0 1.212 1.212l5.814-1.557a11.96 11.96 0 0 0 5.006 1.104h.005c6.554 0 11.848-5.393 11.85-11.947a11.821 11.821 0 0 0-3.482-8.627"/></svg>
                        </button>
                        {/* LinkedIn */}
                        <button
                          aria-label="Partager sur LinkedIn"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                        </button>
                        {/* Reddit */}
                        <button
                          aria-label="Partager sur Reddit"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 6.627 5.373 12 12 12s12-5.373 12-12zm-17.25 2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm-4.25 2.25c0 1.104 2.239 2 5 2s5-.896 5-2v-1h-10v1zm10.5-2.25c0-2.485-2.015-4.5-4.5-4.5s-4.5 2.015-4.5 4.5h9zm-9.5-2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm-4.25-2.25c0-1.104-2.239-2-5-2s-5 .896-5 2v1h10v-1zm-10.5 2.25c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5h-9zm9.5-2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75z"/></svg>
                        </button>
                        {/* Instagram (opens profile, as Instagram does not support direct share links) */}
                        <button
                          aria-label="Voir sur Instagram"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            window.open(
                              `https://www.instagram.com/`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.059-1.281.292-2.393 1.272-3.373.98-.98 2.092-1.213 3.373-1.272C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                        </button>
                        {/* Copy Link */}
                        <button
                          aria-label="Copier le lien"
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Lien copié !');
                          }}
                        >
                          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-2.24 1.82-4.06 4.06-4.06h4.06V6.06H7.96A5.94 5.94 0 0 0 2 12c0 3.28 2.68 5.94 5.96 5.94h4.06v-1.88H7.96v1.88zm6.08-7.88v1.88h4.06A4.06 4.06 0 0 1 21.1 12c0 2.24-1.82 4.06-4.06 4.06h-4.06v1.88h4.06A5.94 5.94 0 0 0 22 12c0-3.28-2.68-5.94-5.96-5.94h-4.06z"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Tags section removed */}
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

              {/* Tags box removed */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsWithSidebar;
