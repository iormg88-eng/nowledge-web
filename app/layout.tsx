import type { Metadata } from "next";
import { Zen_Antique } from "next/font/google";
import "./globals.css";

const zenAntique = Zen_Antique({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-antique",
});

export const metadata: Metadata = {
  title: "農レッジ",
  description: "農業試験の記録・共有プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenAntique.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-zen-antique)]">
        {children}
      </body>
    </html>
  );
}
