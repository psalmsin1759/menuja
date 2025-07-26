import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 customMargin">
      <div className="flex justify-center items-center">
        <Image
          src={"/images/products/product1.png"}
          width={400}
          height={369}
          alt="product"
        />
      </div>
      <div className="flex flex-col gap-4 ">
        <h2 className="text-primary text-2xl md:text-3xl">Today’s Exclusive</h2>
        <p className="text-4xl md:text-7xl text-customblack font-semibold">
          {" "}
          Smoky Party Jollof Rice
        </p>
        <p className="tracking-wide text-textBody">
          Indulge in a rich, spicy, and deeply flavored Nigerian classic —
          slow-cooked with firewood essence, fresh tomatoes, peppers, and
          signature seasoning. Served with: Crispy fried plantains, Juicy
          grilled chicken thigh, Tangy coleslaw, Side of peppered sauce
        </p>
      </div>
    </div>
  );
}
