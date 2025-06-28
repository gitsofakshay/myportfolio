"use client";

import React, { useEffect, useState } from "react";
import SkillSection from "@/components/SkillSection";
import { FaTools } from "react-icons/fa";

export default function SkillsPage() {
  const [skills, setSkills] = useState<{ _id: string; category: string; items: { name: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((res) => res.json())
      .then((data) => {
        console.log("Skills API data:", data); // Debug: log API response
        if (Array.isArray(data)) {
          // Group skills by category, fallback to 'Other' if missing
          const grouped: { [key: string]: { _id: string; category: string; items: { name: string }[] } } = {};
          data.forEach((skill: { name?: string; category?: string }) => {
            if (skill && typeof skill.name === 'string') {
              const cat = typeof skill.category === 'string' && skill.category.trim() ? skill.category : "Other";
              if (!grouped[cat]) {
                grouped[cat] = { _id: cat, category: cat, items: [] };
              }
              grouped[cat].items.push({ name: skill.name });
            }
          });
          setSkills(Object.values(grouped));
        } else setError(data?.error || "Failed to load skills");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load skills");
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen px-2 sm:px-6 md:px-20 py-10 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 flex items-center justify-center gap-2">
        <FaTools className="text-blue-600 dark:text-blue-400 mb-1" /> Technical Skills
      </h2>
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        ) : skills.length > 0 ? (
          skills.map((group) => (
            <SkillSection key={group._id} category={group.category} items={group.items} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No skills data available.</p>
        )}
      </div>
    </section>
  );
}
