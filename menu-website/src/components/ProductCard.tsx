"use client";
import { Product } from "@/constants/data";
import React, { useState } from "react";
import Image from "next/image";
import { SlHandbag } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { useOrdersPanel } from "@/context/OrdersPanelContext";

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
   const { openPanel } = useOrdersPanel();

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1) return;
    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    openPanel()
  };

  return (
    <div className="flex gap-2 p-6 items-start">
      <div className="w-[150px] h-[150px]">
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p className="tracking-wide text-textBody">{product.description}</p>
        <div className="flex gap-4 items-center">
          <div className="flex justify-between gap-2 px-4 py-0.5 rounded-3xl border border-primary">
            <button onClick={handleDecreaseQuantity}>-</button>
            <button>{quantity}</button>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>
          <div
            onClick={handleAddToCart}
            className="cursor-pointer rounded-full bg-primary p-2 text-white"
          >
            <SlHandbag size={12} />
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">₦{product.price}</h1>
      </div>
    </div>
  );
}
