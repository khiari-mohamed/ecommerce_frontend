import BlogDetails from "@/components/BlogDetails";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="text-center py-10 text-gray-400">
        Chargement...
      </div>
    );
  }

  return <BlogDetails slug={slug} />;
}
