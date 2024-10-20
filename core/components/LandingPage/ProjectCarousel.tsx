"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPublicProjects, getTotNoOPenProjects } from "@/actions/db/project";
import { formatTimeAgo } from "@/lib/time";
import { useTheme } from "next-themes";
import NumberCounter from "./number-counter";

type PublicProject = Awaited<ReturnType<typeof getPublicProjects>>;

export default function ProjectShowcase() {
  const [totProjects, setTotProjects] = useState(0);
  const [publicProjects, setPublicProjects] = useState<PublicProject>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const nextProject = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % publicProjects.length);
  }, [publicProjects.length]);

  const prevProject = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + publicProjects.length) % publicProjects.length,
    );
  }, [publicProjects.length]);

  const handlePublicProjectFetch = useCallback(async () => {
    const projects = await getPublicProjects();
    if (projects)
      setPublicProjects((prev) => {
        if (prev.length === 0) return projects;
        return [prev[0], ...projects];
      });
  }, []);

  const handlePublicProjectCount = useCallback(async () => {
    setTotProjects(await getTotNoOPenProjects());
  }, []);

  useEffect(() => {
    handlePublicProjectFetch();
    handlePublicProjectCount();
  }, [handlePublicProjectCount, handlePublicProjectFetch]);

  useEffect(() => {
    const id = setInterval(nextProject, 5000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [nextProject]);

  const handleMouseEnter = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleMouseLeave = () => {
    const id = setInterval(nextProject, 5000);
    setIntervalId(id);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-xl px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">
        <NumberCounter finalNumber={totProjects} />+ Projects deployed at
        <span className="ml-1.5 text-red-500 underline">Deployit</span>
      </h2>
      {publicProjects.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`relative rounded-lg border-2 p-6 shadow-sm ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`mb-2 text-xl font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            >
              {publicProjects[currentIndex].name}
            </h3>
            <p
              className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Deployed {formatTimeAgo(publicProjects[currentIndex].createdAt)}
            </p>
            <Link
              href={"https://" + publicProjects[currentIndex].url}
              target="_blank"
            >
              <Button variant="outline" className="w-full">
                View Project
              </Button>
            </Link>
            <button
              onClick={prevProject}
              className={`absolute left-[-1.5rem] top-1/2 -translate-y-1/2 transform rounded-full bg-gray-500 p-2 shadow-md ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-label="Previous project"
            >
              <ChevronLeft
                className={`h-6 w-6 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-200 hover:text-gray-100"
                }`}
              />
            </button>
            <button
              onClick={nextProject}
              className={`absolute right-[-1.5rem] top-1/2 -translate-y-1/2 transform rounded-full bg-gray-500 p-2 shadow-md ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-label="Next project"
            >
              <ChevronRight
                className={`h-6 w-6 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-200 hover:text-gray-100"
                }`}
              />
            </button>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        {publicProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              index === currentIndex
                ? theme === "dark"
                  ? "w-4 bg-gray-400"
                  : "w-4 bg-gray-800"
                : theme === "dark"
                  ? "bg-gray-600"
                  : "bg-gray-300"
            }`}
            aria-label={`Show project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
