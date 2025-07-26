"use client";

import React, { useState } from "react";
import { categories, Category } from "@/constants/data"; 
import clsx from "clsx";

interface CategoryProps {
  categorySelect : (category: string) => void;
}

export default function CategorySelector({categorySelect}: CategoryProps) {
  const [active, setActive] = useState("all");

  const handleCategorySelect = (category: string) => {
    setActive(category);
    categorySelect(category)
  }


  return (
    <div className="flex flex-wrap gap-4 px-4 py-2 justify-center md:justify-start mt-12">
      {categories.map((category: Category, index) => {
        const Icon = category.icon;
        return (
          <button
            key={index}
            onClick={() => handleCategorySelect(category.value)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-lg font-medium transition-all",
              active === category.value
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-primary hover:text-white"
            )}
          >
            <Icon  />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
