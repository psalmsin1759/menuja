"use client";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

interface MyOrdersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyOrdersPanel({ isOpen, onClose }: MyOrdersPanelProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Orders</h2>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Add cart/order items here */}
          <p className="text-gray-500">You have no items in your order yet.</p>
        </div>
      </div>
    </div>
  );
}
