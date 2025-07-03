// C:\Users\LENOVO\Desktop\ecommerce\template_front\src\app\(admin)\layout.tsx
"use client";
import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import { AuthProvider } from "@/context/authContext";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ReduxProvider>
          <AuthProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    {children}
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}