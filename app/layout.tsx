import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BlogShell from "@/components/blog/BlogShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RainDrop Tech Blog",
    template: "%s | RainDrop Tech Blog",
  },
  description: "MDX-based technical blog powered by Next.js and GitHub Pages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BlogShell>{children}</BlogShell>
      </body>
    </html>
  );
}
