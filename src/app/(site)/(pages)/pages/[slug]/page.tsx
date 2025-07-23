import { fetchPageBySlug } from '@/services/page';
import ConditionsVente from '../../../../../components/StaticPages/ConditionsVente';
import QuiSommesNous from '../../../../../components/StaticPages/QuiSommesNous';
import PolitiquedesCookies from '../../../../../components/StaticPages/PolitiquedesCookies';
import PolitiquedeRemboursement from '../../../../../components/StaticPages/politiquederemboursement';

interface PageProps {
  params: { slug: string };
}

export default async function Page(props: PageProps) {
  const params = await props.params; // Await params here
  const page = await fetchPageBySlug(params.slug);

  if (!page) {
    return <div>Page non trouvée</div>;
  }

  switch (params.slug) {
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