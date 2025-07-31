"use client";
import { Product, products } from "@/constants/data";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import ProductCard from "./ProductCard";

interface PanelProps {
  session: {
    step: string;
    selectedCategory?: string;
    selectedProduct?: string;
    cart: { name: string; quantity: number }[];
  };
}

export default function ProductInteractionPanel({ session }: PanelProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!session.selectedProduct) return;
    dispatch(
      addToCart({ product: products.find(p => p.name === session.selectedProduct)!, quantity: 1 })
    );
  };

  // Show list of products based on selected category
  if (session.step === "product" && session.selectedCategory) {
    const filtered = products.filter(
      (p) => p.category === session.selectedCategory
    );

    return (
      <div className="">
        <h2 className="text-xl font-bold mb-2">Products in {session.selectedCategory}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // Show single product detail after confirmation
  if (session.step === "quantity" && session.selectedProduct) {
    const product = products.find((p) => p.name === session.selectedProduct);
    if (!product) return null;

    return (
      <div className="p-4 border rounded-lg">
        <Image src={product.image} alt={product.name} width={200} height={200} />
        <h2 className="text-2xl font-bold mt-2">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-primary font-semibold mt-2">₦{product.price}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add to Cart
        </button>
      </div>
    );
  }

  return null;
}
