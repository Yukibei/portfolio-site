import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yiling Li — AI Application & Full-Stack Developer",
  description:
    "I turn AI capabilities into real products — agents, RAG and full-stack apps that ship. Portfolio of Yiling Li (李怡霖).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-black">{children}</body>
    </html>
  );
}
