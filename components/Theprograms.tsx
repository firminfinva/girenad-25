"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/style";
import Programme from "./Programme";

interface TeamMember {
  id: string;
  userId: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  order: number;
  featured: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

const Theprograms: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team");
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Hide section while loading
  }

  if (teamMembers.length === 0) {
    return null; // Hide section if no team members
  }

  return (
    <section
      id="clients"
      className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
    >
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
      <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-10 mb-6 relative z-[1]">
        <h1 className={`${styles.heading2} text-black md:text-white`}>
          THE TEAM
        </h1>
      </div>
      <div className="flex flex-wrap sm:justify-start gap-4 justify-center w-full feedback-container relative z-[1]">
        {teamMembers.map((member) => (
          <Programme
            key={member.id}
            id={member.id}
            name={`${member.user.firstName} ${member.user.lastName}`}
            title={member.role || ""}
            content={member.bio || ""}
            email={member.user.email || ""}
            img={member.imageUrl || "/assets/default-avatar.png"}
          />
        ))}
      </div>
    </section>
  );
};

export default Theprograms;
