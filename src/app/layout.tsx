import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "MBA-parts — оригинальные автозапчасти BMW, Mercedes-Benz, VAG",
    template: "%s · MBA-parts",
  },
  description: site.description,
  keywords: site.keywords,
  openGraph: {
    title: "MBA-parts — оригинальные автозапчасти",
    description: site.description,
    locale: "ru_RU",
    type: "website",
  },
  icons: { icon: "/images/logo.png" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: site.name,
    description: site.description,
    telephone: site.phone,
    email: site.email,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: "улица Кедрова, 13к2",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    areaServed: "RU",
  };

  return (
    <html lang="ru" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader pathname={pathname} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
