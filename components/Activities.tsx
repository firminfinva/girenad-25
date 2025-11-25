"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/style";
import ActivityCard from "./ActivityCard";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  imageUrl: string | null;
  status: string;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      if (response.ok) {
        const data = await response.json();
        // Limit to 6 activities, prioritize upcoming ones
        const sorted = data
          .sort((a: Activity, b: Activity) => {
            if (a.status === "UPCOMING" && b.status !== "UPCOMING") return -1;
            if (a.status !== "UPCOMING" && b.status === "UPCOMING") return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 6);
        setActivities(sorted);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <section
      id="activities"
      className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
    >
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-10 mb-6 relative z-[1]">
        <h1 className={`${styles.heading2} text-black md:text-black`}>
          NOS ACTIVITÉS
        </h1>
      </div>
      <div className="flex flex-wrap sm:justify-start gap-4 justify-center w-full feedback-container relative z-[1]">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} {...activity} />
        ))}
      </div>
    </section>
  );
};

export default Activities;
