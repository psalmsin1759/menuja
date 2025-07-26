"use client";
import React from "react";
import { FiPhoneCall } from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import MyOrdersPanel from "./MyOrdersPanel";
import { selectCartCount } from "@/features/cart/cartSelectors";
import { useSelector } from "react-redux";
import { useOrdersPanel } from "@/context/OrdersPanelContext";

export default function Header() {
  const { openPanel } = useOrdersPanel();

  const handleCallWaiter = () => {
    toast.success("A waiter has been called to your table.");
    const audio = new Audio("/sounds/bell.mp3");
    audio.play();
  };

  const cartCount = useSelector(selectCartCount);

  return (
    <>
      <div className="bg-primary text-white bg-[url('/images/header-bg.png')] bg-cover bg-center">
        <div className="flex justify-between bg-black/10 px-4 sm:px-6 lg:px-40 p-8 ">
          <button
            onClick={handleCallWaiter}
            className="flex items-center gap-2 rounded-4xl px-4 md:px-6 py-2 text-sm md:text-base bg-black/30"
          >
            <FiPhoneCall />
            <span>Call Waiter</span>
          </button>

          <button
            onClick={openPanel}
            className="flex items-center gap-2 rounded-4xl px-4 md:px-6 py-2 text-sm md:text-base bg-black/30"
          >
            <div className="relative">
              <IoBagHandleOutline />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>

        <div className="h-52 md:h-[250px] flex flex-col md:flex-row gap-4 justify-center items-center text-center pb-18">
          <span className="text-4xl md:text-5xl font-semibold">OUR MENU</span>
          <div className="hidden md:block border-secondary h-7 border"></div>
          <span className="max-w-sm text-base md:text-2xl text-secondary">
            Smart suggestions powered by AI
          </span>
        </div>
      </div>

      <MyOrdersPanel />
    </>
  );
}
