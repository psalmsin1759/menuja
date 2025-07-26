import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Antonio } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/store";

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
        <div className="">
          <Provider store={store}>
            <Header />
            {children}
            <Footer />
            <ToastContainer
              position="top-center"
              autoClose={2000}
              aria-label={undefined}
            />
          </Provider>
        </div>
      </body>
    </html>
  );
}
