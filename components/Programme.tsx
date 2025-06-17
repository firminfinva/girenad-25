"use client";

import { quotes } from "@/public/assets";
import { FeedBackProps } from "@types";
import Image from "next/image";
import { useState } from "react";

const Programme: React.FC<FeedBackProps> = ({
  content,
  title,
  name,
  img,
  email,
}) => {
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="flex justify-between flex-col px-4 py-8 rounded-[10px] w-full md:w-[calc(25%-1rem)] lg:w-[calc(25%-1.5rem)] cursor-pointer backdrop-blur-md bg-green-500/40 border border-green-300/20 shadow-lg transition-all duration-300 hover:bg-green-400/40">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={img}
            alt={name}
            className="rounded-full object-cover"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-center w-full">
          <h2 className="text-lg text-black font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis px-2">
            {name}
          </h2>
          <p className="text-sm text-white mb-2">{title}</p>
          <p className="text-sm text-white mb-4">{email}</p>
        </div>
      </div>
      <button
        onClick={() => setShowPopup(true)} // Show popup on click
        className="px-6 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-poppins font-medium rounded-lg hover:opacity-90 shadow-lg transition-all duration-300 ease-in-out mt-4"
      >
        Voir resume
      </button>

      {/* Popup for full content */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-[90%] max-h-[90%] overflow-auto">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 mb-4">
                <Image
                  src={img}
                  alt={name}
                  className="rounded-full object-cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
                {name}
              </h2>
              <p className="text-lg text-gray-600 mb-2">{title}</p>
              <p className="text-lg text-blue-600 mb-4">{email}</p>
            </div>
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
