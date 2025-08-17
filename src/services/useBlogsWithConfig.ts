import { useEffect, useState } from "react";
import { Blog } from "@/types/blog";

interface BlogConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
}

export function useBlogsWithConfig() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [config, setConfig] = useState<BlogConfig>({
    sectionTitle: "Blog & FAQ",
    sectionDescription: "Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive",
    maxDisplay: 4,
    showOnFrontend: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleConfigChange = (event: any) => {
      setConfig({
        sectionTitle: event.detail.sectionTitle || "Blog & FAQ",
        sectionDescription: event.detail.sectionDescription || "Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive",
        maxDisplay: event.detail.maxDisplay || 4,
        showOnFrontend: event.detail.showOnFrontend !== false,
      });
    };

    window.addEventListener('blogConfigChanged', handleConfigChange);
    return () => window.removeEventListener('blogConfigChanged', handleConfigChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      try {
        const [blogsRes, configRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/blogs`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/blog/config`)
        ]);

        let mapped: Blog[] = [];
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          console.log('Frontend blogs data:', blogsData);
          if (Array.isArray(blogsData)) {
            mapped = blogsData.filter(blog => blog.publier === '1');
          }
        }

        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData && isMounted) {
            setConfig({
              sectionTitle: configData.sectionTitle || "Blog & FAQ",
              sectionDescription: configData.sectionDescription || "Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive",
              maxDisplay: configData.maxDisplay || 4,
              showOnFrontend: configData.showOnFrontend !== false,
            });
          }
        } else {
          const saved = localStorage.getItem('blogConfig');
          if (saved && isMounted) {
            const configData = JSON.parse(saved);
            setConfig({
              sectionTitle: configData.sectionTitle || "Blog & FAQ",
              sectionDescription: configData.sectionDescription || "Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive",
              maxDisplay: configData.maxDisplay || 4,
              showOnFrontend: configData.showOnFrontend !== false,
            });
          }
        }

        if (isMounted) {
          setBlogs(mapped);
        }
      } catch (e) {
        console.error("Error fetching blogs or config:", e);
        if (isMounted) setBlogs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedBlogs = config.showOnFrontend 
    ? blogs.slice(0, config.maxDisplay) 
    : [];

  return { 
    blogs: displayedBlogs, 
    config, 
    loading,
    showSection: config.showOnFrontend 
  };
}