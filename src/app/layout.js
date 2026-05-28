import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./responsive.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata = {
  metadataBase: new URL('https://ncm-website.vercel.app'), // Replace with actual domain when available
  title: {
    default: "NuttyChocoMorsels | Premium 100% Eggless Bakery in Gandhinagar",
    template: "%s | NuttyChocoMorsels"
  },
  description: "Experience the taste of luxury in Gandhinagar - 100% Eggless Bakery. Delicious homemade chocolates, brownies, cheesecakes, and artisanal treats. Freshly baked with premium ingredients.",
  keywords: ["bakery in gandhinagar", "eggless bakery", "premium chocolates", "best brownies in gandhinagar", "nuttychocomorsels", "NCM bakery", "handmade chocolates", "cheesecakes gandhinagar"],
  authors: [{ name: "Shrikant Limbachiya" }, { name: "Mihirkumar Patel" }],
  creator: "NuttyChocoMorsels",
  publisher: "NuttyChocoMorsels",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  icons: {
    icon: "/assets/icons/favicon.ico",
    shortcut: "/assets/icons/favicon-32x32.png",
    apple: "/assets/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "NuttyChocoMorsels | Premium 100% Eggless Bakery",
    description: "Indulge in our premium 100% eggless delights. From signature brownies to viral chocolates, we bring luxury bakery to your doorstep.",
    url: 'https://ncm-website.vercel.app',
    siteName: 'NuttyChocoMorsels',
    images: [
      {
        url: '/assets/images/logo.png',
        width: 800,
        height: 600,
        alt: 'NuttyChocoMorsels Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuttyChocoMorsels | Premium 100% Eggless Bakery',
    description: 'Freshly baked premium delights delivered in Gandhinagar.',
    images: ['/assets/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
