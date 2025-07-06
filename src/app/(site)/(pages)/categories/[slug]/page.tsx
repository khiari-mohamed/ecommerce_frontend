import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/services/categories';
import { getAllSubCategories } from '@/services/subcategories';
import { getProductListPage } from '@/services/products';
import ProductSlider from '@/components/ProductSlider';
import SubcategoryList from '@/components/Subcategory/SubcategoryList';
import parse from 'html-react-parser';
import Image from 'next/image';




interface CategoryPageProps {
  params?: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const slug = params?.slug;
  if (!slug) return {};
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.designation_fr || category?.designation || 'Category',
    description: category?.description_fr
      ? category.description_fr.replace(/<[^>]*>/g, '').substring(0, 160)
      : '',
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = params?.slug;
  try {
    if (!slug) {
      notFound();
      return null;
    }
    const category = await getCategoryBySlug(slug);

    if (!category) {
      notFound();
      return null;
    }

    const allSubcategories = await getAllSubCategories();
    const subcategories = allSubcategories.filter(
      (subcat) => String(subcat.categorie_id) === String(category.id)
    );

    const { products: allProducts } = await getProductListPage("limit=1000");
    const subcategoryIds = subcategories.map(sub => String(sub.id));

    const products = allProducts.filter(prod =>
      prod.sous_categorie_id && subcategoryIds.includes(String(prod.sous_categorie_id))
    );

    return (
      <>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function setHeaderOffset() {
              function updateOffset() {
                var header = document.querySelector('header');
                if (!header) return;
                var isMobile = window.innerWidth < 640;
                if (isMobile) {
                  var headerHeight = header.offsetHeight;
                  document.documentElement.style.setProperty('--header-offset', headerHeight + 'px');
                } else {
                  document.documentElement.style.setProperty('--header-offset', '140px');
                }
              }
              updateOffset();
              window.addEventListener('resize', updateOffset);
              window.addEventListener('orientationchange', updateOffset);
            })();
          `
        }} />
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8" style={{ paddingTop: 'var(--header-offset, 140px)' }}>
          <div className="mb-8 sm:mb-12 relative rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-white to-gray-100 overflow-hidden">
            {category.cover && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.cover || '/default-cover.jpg'}
                  alt={category.designation_fr || category.designation || 'Category'}
                  width={1200}
                  height={400}
                  className="w-full h-full object-cover opacity-40 blur-[2px] scale-105"
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
              </div>
            )}
            <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-3 tracking-tight text-center break-words">
                {category.designation_fr || category.designation}
              </h1>
              {category.description_fr && (
                <div className="prose max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-none text-center text-gray-700 mb-2 mx-auto !text-[15px] sm:!text-base !leading-tight">
                  {parse(category.description_fr)}
                </div>
              )}
            </div>
          </div>

          <div id="products" className="mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 tracking-tight flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-400 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /></svg>
              Produits
            </h2>
            {products.length > 0 ? (
              <ProductSlider products={products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white/80 rounded-xl shadow-inner border border-dashed border-blue-100">
                <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                <p className="text-xl text-gray-400 font-medium">Aucun produit dans cette catégorie</p>
              </div>
            )}
          </div>

          {subcategories && subcategories.length > 0 && (
            <div className="mb-12">
              <div className="bg-white/80 rounded-xl shadow-lg p-6 border border-blue-100">
                <SubcategoryList subcategories={subcategories} />
              </div>
            </div>
          )}

          {category.nutrition_values && (
            <div className="mb-8 bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Valeurs Nutritionnelles</h2>
              <div className="prose max-w-none">
                {parse(category.nutrition_values)}
              </div>
            </div>
          )}

          {category.more_details && (
            <div className="prose max-w-none bg-white/80 rounded-xl shadow p-8 border border-blue-100">
              {parse(category.more_details)}
            </div>
          )}
        </div>
      </>
    );
  } catch (err) {
    console.error('Category page error:', err);
    notFound();
    return null;
  }
}
