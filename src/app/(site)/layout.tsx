import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Your Site Name",
  description: "Your site description here.",
  openGraph: {
    title: "Your Site Name",
    description: "Your site description here.",
    url: "https://yourdomain.com",
    siteName: "Your Site Name",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your Site Name",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Site Name",
    description: "Your site description here.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
