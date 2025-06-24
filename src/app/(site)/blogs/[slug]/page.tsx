import BlogDetails from "@/components/BlogDetails";
import BlogDetailsWithSidebar from "@/components/BlogDetailsWithSidebar";

interface BlogDetailsPageProps {
  params: { slug: string };
}

const BlogDetailsPage = async ({ params }: BlogDetailsPageProps) => {
  // Toggle this flag to switch between components
  const useSidebar = true;

  if (!params?.slug) {
    return <div className="text-center py-10 text-gray-400">Chargement...</div>;
  }

  return useSidebar ? (
    <BlogDetailsWithSidebar slug={params.slug} />
  ) : (
    <BlogDetails slug={params.slug} />
  );
};

export default BlogDetailsPage;