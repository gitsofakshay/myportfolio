"use client";

import React, { useEffect, useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import { FaBriefcase } from "react-icons/fa";

interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/experience")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExperiences(data);
        else setError(data?.error || "Failed to load experience");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load experience");
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-2 sm:px-4 md:px-20 w-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 flex items-center justify-center gap-2">
        <FaBriefcase className="text-blue-600 dark:text-blue-400 mb-1" />{" "}
        Professional Experience
      </h2>
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        ) : experiences.length > 0 ? (
          experiences.map((exp) => <ExperienceCard key={exp._id} {...exp} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No experience data available.
          </p>
        )}
      </div>
    </section>
  );
}
