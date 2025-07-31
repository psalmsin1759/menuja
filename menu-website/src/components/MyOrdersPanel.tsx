"use client";

import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { useOrdersPanel } from "@/context/OrdersPanelContext";
import { useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from "@/features/cart/cartSelectors";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { removeFromCart } from "@/features/cart/cartSlice";
import { IoTrashOutline } from "react-icons/io5";

export default function MyOrdersPanel() {
  const { isOpen, closePanel } = useOrdersPanel();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const dispatch = useAppDispatch();

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        onClick={closePanel}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>

      <div className="absolute right-0 top-0 h-full w-[80%] sm:w-[400px] md:w-[480px] bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Orders ({count})</h2>
          <button onClick={closePanel}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">
              You have no items in your order yet.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  {item.product.image && (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-medium">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <IoTrashOutline size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
