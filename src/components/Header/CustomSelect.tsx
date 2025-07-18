'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CustomSelect = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    toggleDropdown();

    // Navigate to the selected category page (assuming `option.value` is the slug)
    if (option?.value) {
      router.push(`/categories/${option.value}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.dropdown-content')) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="dropdown-content custom-select relative w-full max-w-[200px] sm:max-w-[160px]"
      style={{ minWidth: '0' }}
    >
      <div
        className={`select-selected whitespace-nowrap ${isOpen ? 'select-arrow-active' : ''}`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </div>
      <div
        className={`select-items ${isOpen ? '' : 'select-hide'} max-h-60 overflow-y-auto w-full left-0 right-0`}
        style={{ minWidth: '0' }}
      >
        {options.slice(1, -1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${selectedOption === option ? 'same-as-selected' : ''}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
