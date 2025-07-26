"use client"
import React, { useState } from "react";
import CategorySelector from "./CategorySelector";
import ProductSection from "./ProductSection";

export default function MenuMain() {

  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  } 

  return (
    <div className="customMargin bg-menubg px-4 sm:px-6 lg:px-40 p-8 mt-12">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-center">
        <span className="text-4xl md:text-5xl font-semibold">Menu</span>
        <div className="hidden md:block border-secondary h-7 border"></div>
        <span className="max-w-sm text-base md:text-2xl text-primary">
          Category
        </span>
      </div>
      <CategorySelector categorySelect={handleCategorySelect} />
      <ProductSection category={selectedCategory} />
    </div>
  );
}
