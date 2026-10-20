// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Demo Susanto",
  description:
    "Demo Susanto is a Frontend Developer and UI/UX Designer who specializes in building (and designing) exceptional digital experiences.",
  icons: {
    icon: [
      { url: "/images/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }, { lang: "ja" }];
}

// 1. Tambahkan kata 'async' sebelum function
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  // 2. Ubah tipe params menjadi Promise
  params: Promise<{ lang: string }>;
}>) {

  // 3. Gunakan 'await' untuk mengekstrak nilai lang dari Promise params
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";

  return (
    // 4. Gunakan variabel lang yang sudah diekstrak
    <html lang={lang} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} ${firaCode.variable}`}>{children}</body>
    </html>
  );
}