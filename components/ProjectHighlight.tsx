"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/style";
import { layout } from "@/styles/style";
import Button from "./Button";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  overview: string | null;
  status: string;
}

const ProjectHighlight: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const allProjects: Project[] = await response.json();
          // Prioritize projects with status "ONGOING", then add others up to 6 total
          const ongoingProjects = allProjects.filter(
            (p) => p.status === "ONGOING"
          );
          const otherProjects = allProjects.filter(
            (p) => p.status !== "ONGOING"
          );
          // Combine: ongoing first, then others, limit to 6
          const selectedProjects = [...ongoingProjects, ...otherProjects].slice(
            0,
            6
          );
          setProjects(selectedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return null; // Hide section while loading
  }

  if (projects.length === 0) {
    return null; // Hide section if no projects
  }

  return (
    <section id="projet" className={`${layout.section} bg-green-50 py-16`}>
      <div className={`${styles.boxWidth} mx-auto px-4`}>
        <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
          Projets en cours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-4 text-black">
                {project.title}
              </h3>
              <p className="text-gray-700 mb-6 flex-grow line-clamp-3">
                {project.overview || "Découvrez notre projet en cours."}
              </p>
              <Link href={`/projet?id=${project.id}`} legacyBehavior>
                <a className="mt-auto">
                  <Button styles="w-full" text="Voir le projet" />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectHighlight;
