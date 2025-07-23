import Header from "@/components/Header";
import { Page } from "@/types/page";

interface Props {
  page: Page;
}

const QuiSommesNous = ({ page }: Props) => {
  return (
    <>
      <Header />
      <div className="w-full bg-[#F2F2F2] flex flex-col items-center pt-0 pb-12 min-h-screen overflow-x-hidden">
        {/* Map section */}
        <div className="w-full h-[250px] sm:h-[350px] bg-white flex items-center justify-center shadow-md mt-8 sm:mt-20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3074.4748320799786!2d10.630564999999997!3d35.836349299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20%E2%80%93%20SOBITAS%20%7C%20Creatine%2C%20Mat%C3%A9riel%20de%20Musculation%20%26%20Whey%20%C3%A0%20Sousse!5e1!3m2!1sfr!2sus!4v1752469342748!5m2!1sfr!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Notre emplacement"
            className="rounded-md"
          />
        </div>
        <div className="w-full max-w-9xl bg-white shadow-md py-8 px-4 sm:px-10 mt-6 sm:mt-8 z-10 relative mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#FF5000]">
            {page.title}
          </h1>
          <article
            className="prose about_content max-w-none text-base sm:text-lg leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
          <div className="text-center mt-8 text-black text-base sm:text-lg leading-relaxed">
            <strong>Adresse:</strong> Rue Ribat, 4000 Sousse Tunisie<br />
            <strong>Téléphone:</strong> +216 27 612 500 / +216 73 200 169<br />
            <strong>Email:</strong> contact@protein.tn
          </div>
        </div>
      </div>
      {/* Remove <Footer /> here if it's already globally included */}
    </>
  );
};

export default QuiSommesNous;