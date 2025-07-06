"use client";
import { useEffect } from "react";

export default function ClientHeaderOffset() {
  useEffect(() => {
    function updateOffset() {
      const header = document.querySelector('header');
      if (!header) {
        document.documentElement.style.setProperty('--header-offset', '70px');
        return;
      }
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        setTimeout(() => {
          const headerHeight = header.offsetHeight;
          document.documentElement.style.setProperty('--header-offset', (headerHeight > 0 ? headerHeight : 70) + 'px');
        }, 50);
      } else {
        document.documentElement.style.setProperty('--header-offset', '70px');
      }
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    window.addEventListener('orientationchange', updateOffset);
    const header = document.querySelector('header');
    if (header) {
      header.addEventListener('transitionend', updateOffset);
    }
    return () => {
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('orientationchange', updateOffset);
      if (header) header.removeEventListener('transitionend', updateOffset);
    };
  }, []);
  return null;
}
