import type { Metadata } from "next";
import { Antonio } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Menuja",
  description: "Menuja — Smart Digital Menu",
};

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={antonio.className}>
        {children}
      </body>
    </html>
  );
}
