import { notFound } from 'next/navigation';
import { SubCategory } from '@/types/subcategory';
import axios from '@/lib/axios';
import parse from 'html-react-parser';
import Image from 'next/image';

async function getSubCategoryBySlug(slug: string): Promise<SubCategory | null> {
  try {
    const res = await axios.get(`/sub-categories?slug=${slug}`);
    if (res.data && res.data.data && res.data.data.length > 0) {
      return res.data.data[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default async function SubcategoryPage({
  params,
}: {
  params?: { slug: string };
}) {
  const slug = params?.slug;
  const subcategory = await getSubCategoryBySlug(slug);

  if (!subcategory) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Subcategory Header */}
      <div className="mb-8">
        {subcategory.cover && (
          <div className="relative h-40 md:h-64 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={subcategory.cover}
              alt={subcategory.name || subcategory.designation_fr || subcategory.designation || "Subcategory"}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2">
          {subcategory.name || subcategory.designation_fr || subcategory.designation}
        </h1>
        
        {subcategory.description_fr && (
          <div className="prose max-w-none mb-8">
            {parse(subcategory.description_fr)}
          </div>
        )}
      </div>

      {/* Products Grid (future-ready) */}
      {subcategory.products && subcategory.products.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Produits</h2>
          {/* Uncomment and implement ProductItem if you have product details:
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategory.products.map(product => (
              <ProductItem key={product._id || product.id} item={product} />
            ))}
          </div>
          */}
          <p>Produits à venir...</p>
        </div>
      )}

      {/* Additional Sections */}
      {subcategory.nutrition_values && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Valeurs Nutritionnelles</h2>
          <div className="prose max-w-none">
            {parse(subcategory.nutrition_values)}
          </div>
        </div>
      )}

      {subcategory.more_details && (
        <div className="prose max-w-none">
          {parse(subcategory.more_details)}
        </div>
      )}
    </div>
  );
}
