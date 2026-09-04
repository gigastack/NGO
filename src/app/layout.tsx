import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abuja Resilience Initiative | From Granite to Grassroots",
  description: "Extensible civic portal championing grassroots resilience, primary healthcare, clean water aquifers, and youth STEM across the six Area Councils of Abuja, FCT Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-parchment-ground)] text-[var(--color-granite-deep)] selection:bg-[var(--color-terracotta-surface)] selection:text-[var(--color-terracotta-primary)] antialiased">
        <div dangerouslySetInnerHTML={{ __html: "<!-- IMPECCABLE DIRECTION CONTRACT: Warm Afro-Modernism | Abuja Resilience Initiative -->" }} style={{ display: "contents" }} />
        {children}
      </body>
    </html>
  );
}
