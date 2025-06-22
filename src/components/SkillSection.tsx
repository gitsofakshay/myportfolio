import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SkillSectionProps {
  category: string;
  items: { name: string }[];
}

export default function SkillSection({ category, items }: SkillSectionProps) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <FaCheckCircle className="text-green-500" /> {category}
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((skill, idx) => (
          <span
            key={idx}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full shadow-sm hover:scale-105 transition-transform flex items-center gap-1"
          >
            <FaCheckCircle className="text-green-400" /> {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
