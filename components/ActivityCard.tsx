"use client";

import Image from "next/image";
import Link from "next/link";

interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string | null;
  imageUrl?: string | null;
  status?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  imageUrl,
  status,
}) => {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Default image or use activity image
  const displayImage = imageUrl || "/assets/default-activity.png";

  return (
    <div className="flex justify-between flex-col px-4 py-8 rounded-[10px] w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.5rem)] cursor-pointer backdrop-blur-md bg-green-500/40 border border-green-300/20 shadow-lg transition-all duration-300 hover:bg-green-400/40">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={displayImage}
            alt={title}
            className="rounded-full object-cover"
            fill
            style={{ objectFit: "cover" }}
            onError={(e) => {
              // Fallback to a simple div if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
        <div className="text-center w-full">
          <h2 className="text-lg text-black font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis px-2">
            {title}
          </h2>
          <p className="text-sm text-white mb-2">{formattedDate}</p>
          {location && (
            <p className="text-xs text-white/80 mb-2">📍 {location}</p>
          )}
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
