import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="w-[120px] sm:w-[160px] md:w-[172px] z-100">
      <Link href={"/"}>
        <Image
          src="/images/logo.png"
          alt="Menuja"
          width={172}
          height={45}
          className="w-full h-auto"
          priority
        />
      </Link>
    </div>
  );
}
