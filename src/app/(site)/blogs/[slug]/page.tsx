import BlogDetails from "@/components/BlogDetails";
import BlogDetailsWithSidebar from "@/components/BlogDetailsWithSidebar";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Toggle this flag to switch between components
  const useSidebar = true;

  if (!slug) {
    return <div className="text-center py-10 text-gray-400">Chargement...</div>;
  }

  return useSidebar ? (
    <BlogDetailsWithSidebar slug={slug} />
  ) : (
    <BlogDetails slug={slug} />
  );
}