"use client";

import React, { useEffect, useState } from "react";
import EducationCard from "@/components/EducationCard";
import { FaGraduationCap } from "react-icons/fa";

interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying?: boolean;
  gradeOrPercentage?: string;
  description?: string[];
  location?: string;
}

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/education")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEducationList(data);
        else setError(data?.error || "Failed to load education");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load education");
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen py-16 px-2 sm:px-6 md:px-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 flex items-center justify-center gap-2">
        <FaGraduationCap className="text-blue-600 dark:text-blue-400 mb-1" /> Education
      </h2>
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          {educationList.length > 0 ? (
            educationList.map((edu) => <EducationCard key={edu._id} education={edu} />)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No education data available.</p>
          )}
        </div>
      )}
    </section>
  );
}
