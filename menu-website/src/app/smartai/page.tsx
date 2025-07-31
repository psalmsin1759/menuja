"use client";
import AIDisplay from "@/components/AIDisplay";
import { useAI } from "@/hooks/useAI";
import React from "react";
import { FaRegCircleStop } from "react-icons/fa6";
import { IoMicOutline } from "react-icons/io5";

export default function SmartAI() {
   const { isConnected, transcripts, error, startAI, stopAI } = useAI();

  const getButtonIcon = () => {
    if (isConnected) {
      return <FaRegCircleStop size={28} />;
    } else {
      return <IoMicOutline size={28} />;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-40 py-6 flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold">
          👋 Hi there, I&apos;m <span className="text-primary">Cynthia</span> —
          your AI assistant.
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          I&apos;m here to help you browse the menu, take orders, and assist
          with anything you need.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {error && <p className="text-red-500">{error}</p>}
          Status:{" "}
          <span
            className={isConnected ? "text-green-600 font-medium" : "text-gray-500"}
          >
            {isConnected ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={isConnected ? stopAI : startAI}
          className={`bg-primary text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110`}
        >
          {getButtonIcon()}
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {transcripts.map((t, i) => (
          <p key={i} className={t.finalized ? "font-bold" : "text-gray-500"}>
            {t.text}
          </p>
        ))}
      </div>

      <AIDisplay />
    </div>
  );
}
