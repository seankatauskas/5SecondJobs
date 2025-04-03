import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers'
import Navbar from '@/app/ui/navbar'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiveSecondJobs",
  description: "Job applications for power users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <div className="container mx-auto max-w-4xl flex-grow flex flex-col">
          <Navbar />
          <Providers>{children}</Providers>
        </div>
        
        <footer className="w-full py-4 bg-gray-100 ">
        <div className="mx-auto max-w-4xl">
          <p>© 2025 Sean Katauskas</p>
        </div>
        </footer>
      </body>
    </html>
  );
}

