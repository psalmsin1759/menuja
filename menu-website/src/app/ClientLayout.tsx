"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrdersPanelProvider } from "@/context/OrdersPanelContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <OrdersPanelProvider>
        <Header />
        {children}
        <Footer />
        <ToastContainer position="top-center" autoClose={2000} />
      </OrdersPanelProvider>
    </Provider>
  );
}
