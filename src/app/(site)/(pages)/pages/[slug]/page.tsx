import { fetchPageBySlug } from '@/services/page';
import ConditionsVente from '../../../../../components/StaticPages/ConditionsVente';
import QuiSommesNous from '../../../../../components/StaticPages/QuiSommesNous';
import PolitiquedesCookies from '../../../../../components/StaticPages/PolitiquedesCookies';
import PolitiquedeRemboursement from '../../../../../components/StaticPages/politiquederemboursement';

export default async function Page({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const page = await fetchPageBySlug(slug);

  if (!page) {
    return <div>Page non trouvée</div>;
  }

  switch (slug) {
    case 'conditions-generale-de-ventes-protein.tn':
      return <ConditionsVente page={page} />;
    case 'qui-sommes-nous':
      return <QuiSommesNous page={page} />;
    case 'politique-des-cookies':
      return <PolitiquedesCookies page={page} />;
    case 'politique-de-remboursement':
      return <PolitiquedeRemboursement page={page} />;
    default:
      return (
        <main>
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.body }} />
        </main>
      );
  }
}