import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaCheckCircle } from "react-icons/fa";

interface ExperienceCardProps {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string[];
}

export default function ExperienceCard({
  title,
  company,
  location,
  startDate,
  endDate,
  currentlyWorking,
  description = [],
}: ExperienceCardProps) {
  // Format dates
  const start = new Date(startDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
  const end = currentlyWorking
    ? "Present"
    : endDate
    ? new Date(endDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "-";

  return (
    <div className="bg-white/90 dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-8 transition hover:shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <FaBuilding className="text-blue-400" /> {company}
          </h3>
          <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> {title}
          </span>
          {location && (
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaMapMarkerAlt className="inline-block mr-1" /> {location}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2 md:mt-0">
          <FaCalendarAlt className="inline-block mr-1" />
          {start} - {end}
        </span>
      </div>
      {description && description.length > 0 && (
        <ul className="mt-4 list-disc list-inside text-gray-800 dark:text-gray-200 space-y-1">
          {description.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
