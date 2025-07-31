"use client";

import { BsRobot } from "react-icons/bs";
import { toast } from "react-toastify";
import Link from "next/link"

export default function AskAIButton() {
  return (
    <Link
      href={"/smartai"}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 shadow-lg hover:bg-gray-900 transition"
    >
      <BsRobot size={20} />
      <span className=" sm:inline">Ask AI</span>
    </Link>
  );
}
