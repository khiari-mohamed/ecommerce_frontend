'use client';

interface FAQSearchProps {
  onSearch: (term: string) => void;
}

// Remove the search bar and blurry area, render nothing
const FAQSearch = (_: FAQSearchProps) => {
  return null;
};

export default FAQSearch;
