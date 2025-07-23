'use client';

import { useState, useEffect } from 'react';
import { FAQ } from '@/types/faq';

interface FAQItemProps {
  faq: FAQ;
  index: number;
  openByDefault?: boolean;
}

const FAQItem = ({ faq, index, openByDefault = false }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(openByDefault);

  useEffect(() => {
    setIsOpen(openByDefault);
    // eslint-disable-next-line
  }, [openByDefault]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-4 text-left focus:outline-none"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq._id}`}
      >
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold !text-black w-8 text-right">
            {faq.id.padStart(2, '0')}
          </span>
          <span className="text-base font-medium !text-black">
            {faq.question}
          </span>
        </div>
        <span className="ml-4 flex items-center justify-center h-8 w-8 rounded-full border border-[#FF4500] text-2xl font-bold !text-black transition-colors"
          style={{ minWidth: 32, minHeight: 32 }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={`faq-answer-${faq._id}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pl-14 pr-2 pb-4 pt-1 text-sm !text-black">
          <div
            className="prose prose-sm max-w-none prose-headings:!text-black prose-p:!text-black prose-strong:!text-black prose-a:!text-black prose-ul:!text-black prose-ol:!text-black"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
      </div>
      {/* Thin orange separator line */}
      <hr className="faq-separator w-full my-1" />
    </div>
  );
};

export default FAQItem;
