import "./globals.css";

const SITE_URL = "https://ricardoriffo.cl";
const description = "Arriendo y venta de propiedades en Santiago, visitadas y grabadas personalmente por Ricardo Riffo.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ricardo Riffo Propiedades",
    template: "%s — Ricardo Riffo Propiedades",
  },
  description,
  openGraph: {
    title: "Ricardo Riffo Propiedades",
    description,
    url: SITE_URL,
    siteName: "Ricardo Riffo Propiedades",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricardo Riffo Propiedades",
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
