"use client";

import { ActivityProps } from "@types";
import Image from "next/image";
import Link from "next/link";

const ActivityCard: React.FC<ActivityProps> = ({
  id,
  title,
  description,
  date,
  img,
  frenchTitle,
}) => {
  return (
    <div className="flex justify-between flex-col px-4 py-8 rounded-[10px] w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.5rem)] cursor-pointer backdrop-blur-md bg-green-500/40 border border-green-300/20 shadow-lg transition-all duration-300 hover:bg-green-400/40">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={img}
            alt={title}
            className="rounded-full object-cover"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-center w-full">
          <h2 className="text-lg text-black font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis px-2">
            {frenchTitle || title}
          </h2>
          <p className="text-sm text-white mb-2">{date}</p>
        </div>
      </div>
      <Link href={`/activities/${id}`}>
        <button className="px-6 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-poppins font-medium rounded-lg hover:opacity-90 shadow-lg transition-all duration-300 ease-in-out mt-4">
          Voir détails
        </button>
      </Link>
    </div>
  );
};

export default ActivityCard;
