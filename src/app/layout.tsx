import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "./providers/SessionProvider";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./context/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes App",
  description: "Task management app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
       <head>
         <link rel="icon" href="/file.svg" />
         <link rel="manifest" href="/manifest.json" />
         <meta name="theme-color" content="#10b981" />
         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
         <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
       </head>
    <body className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <NextAuthSessionProvider>
          <ThemeProvider>
            <header className="p-4 flex justify-end">
              <ThemeToggle />
            </header>
            {children}
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
