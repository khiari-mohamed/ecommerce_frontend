// src/components/StaticPages/ConditionsVente.tsx

import Header from "@/components/Header";
import { Page } from "@/types/page";

interface Props {
  page: Page;
}

const ConditionsVente = ({ page }: Props) => {
  return (
    <>
      <Header />
      <div className="w-full bg-[#F2F2F2] flex flex-col items-center pt-0 xl:pt-14 pb-12 min-h-screen overflow-x-hidden">
        <div className="w-full max-w-9xl bg-white shadow-md py-8 px-4 sm:px-10 mt-8 z-10 relative mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#FF5000]">
            {page.title}
          </h1>
          <article
            className="prose about_content max-w-none text-base sm:text-lg leading-loose space-y-6"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </div>
    </>
  );
};

export default ConditionsVente;