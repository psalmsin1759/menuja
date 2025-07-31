"use client";
import { useVapi, CALL_STATUS } from "@/vapi/useVapi";
import React from "react";
import { IoMicOutline } from "react-icons/io5";
import { FaRegCircleStop } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import AIDisplay from "@/components/AIDisplay";

export default function AIAssistance() {
  const { toggleCall, callStatus, suggestedItems } = useVapi();

  const getButtonIcon = () => {
    switch (callStatus) {
      case CALL_STATUS.LOADING:
        return <ImSpinner8 size={24} />;
      case CALL_STATUS.ACTIVE:
        return <FaRegCircleStop size={28} />;
      default:
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
          Status:{" "}
          <span
            className={
              callStatus === CALL_STATUS.ACTIVE
                ? "text-green-600 font-medium"
                : callStatus === CALL_STATUS.LOADING
                ? "text-yellow-600 font-medium"
                : "text-gray-500"
            }
          >
            {callStatus === CALL_STATUS.ACTIVE
              ? "Active"
              : callStatus === CALL_STATUS.LOADING
              ? "Connecting..."
              : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={toggleCall}
          disabled={callStatus === CALL_STATUS.LOADING}
          className={`bg-primary text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110
            ${
              callStatus === CALL_STATUS.ACTIVE
                ? "bg-red-600 hover:bg-red-700"
                : "hover:bg-indigo-700"
            }
            ${
              callStatus === CALL_STATUS.LOADING
                ? "opacity-70 cursor-not-allowed"
                : "animate-pulse"
            }
          `}
        >
          {getButtonIcon()}
        </button>
      </div>

      <AIDisplay />
    </div>
  );
}
