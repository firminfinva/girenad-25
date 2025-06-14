"use client";

import { quotes } from "@/public/assets";
import { FeedBackProps } from "@types";
import Image from "next/image";
import { useState } from "react";

const Programme: React.FC<FeedBackProps> = ({ content, title, name, img }) => {
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="flex justify-between flex-col px-2 py-12 rounded-[20px] xs:max-w-[30%] w-[100%] md:mr-10 sm:mr-5 mr-0 cursor-pointer backdrop-blur-md bg-white/40 border border-white/20 shadow-lg transition-all duration-300 hover:bg-green-200/30">
      <Image
        src={img}
        alt={name}
        className="rounded-[5px] object-cover object-center"
        width={480}
        height={480}
      />
      <h2 className="text-xl text-black font-bold mb-4">{title}</h2>
      <p className="font-poppins font-normal text-[12px] leading-[22px] text-black my-1">
        {truncateText(content, 150)}{" "}
      </p>
      <button
        onClick={() => setShowPopup(true)} // Show popup on click
        className="px-6 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-poppins font-medium rounded-lg hover:opacity-90 shadow-lg transition-all duration-300 ease-in-out"
      >
        Afficher plus
      </button>

      {/* Popup for full content */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-[90%] max-h-[90%] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="text-gray-800 text-base">{content}</p>
            <button
              onClick={() => setShowPopup(false)} // Hide popup on click
              className="mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programme;
