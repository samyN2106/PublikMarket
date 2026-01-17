import "./globals.css";

export const metadata = {
  title: "PublikMarket",
  description:
    "Publiez et vendez vos produits en toute simplicité grâce à notre système d’abonnement sécurisé.",
  keywords: [
    "PublikMarket",
    "marketplace",
    "e-commerce",
    "abonnement sécurisé",
  ],
  authors: [{ name: "Samuel Nayo" }],
  openGraph: {
    title: "PublikMarket - Votre marketplace moderne",
    description:
      "Découvrez PublikMarket, la marketplace moderne pour vos achats et ventes en ligne.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "PublikMarket",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "PublikMarket Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PublikMarket - Votre marketplace moderne",
    description:
      "Découvrez PublikMarket, la marketplace moderne pour vos achats et ventes en ligne.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-default.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
