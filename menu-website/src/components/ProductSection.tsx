"use client";
import React, { useEffect, useState } from "react";
import { products, Product } from "@/constants/data";
import ProductCard from "./ProductCard";

interface CategoryProps {
  category: string;
}

export default function ProductSection({ category }: CategoryProps) {
  const [productFilter, setProductFilter] = useState<Product[]>([]);

  useEffect(() => {
    if (category === "all") {
      setProductFilter(products);
    } else {
      setProductFilter(
        products.filter((product) => product.category === category)
      );
    }
  }, [category]);

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2">
      {productFilter.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
