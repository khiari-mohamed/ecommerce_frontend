"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
//import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { AuthProvider } from "@/context/authContext";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/fr" || pathname === "/en";
  const isCheckout = pathname === "/checkout";

  return (
    <>
      {loading ? (
        <PreLoader />
      ) : (
        <>
          <ReduxProvider>
            <AuthProvider>
                <CartModalProvider>
                  <ModalProvider>
                    <PreviewSliderProvider>
                      {!isCheckout && <Header />}
                    <div className={isHomePage || isCheckout ? '' : 'pt-[70px] sm:pt-[100px] md:pt-[120px] lg:pt-[130px]'}>
                        {children}
                      </div>
                      <QuickViewModal />
                      <CartSidebarModal />
                 
                    </PreviewSliderProvider>
                  </ModalProvider>
                </CartModalProvider>
            </AuthProvider>
          </ReduxProvider>
          <ScrollToTop />
          <Footer />
        </>
      )}
    </>
  );
}
