import React from "react";
import { FaUniversity, FaMapMarkerAlt, FaCalendarAlt, FaBook } from "react-icons/fa";

interface EducationCardProps {
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    currentlyStudying?: boolean;
    gradeOrPercentage?: string;
    description?: string[];
    location?: string;
  };
}

export default function EducationCard({ education }: EducationCardProps) {
  // Format dates
  const start = new Date(education.startDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
  const end = education.currentlyStudying
    ? "Present"
    : education.endDate
    ? new Date(education.endDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "-";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8 hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-1">
        <FaUniversity className="text-blue-400" /> {education.degree}
      </h3>
      {education.fieldOfStudy && (
        <p className="text-base text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
          <FaBook className="text-green-500" /> {education.fieldOfStudy}
        </p>
      )}
      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
        {education.institution}
        {education.location && (
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaMapMarkerAlt /> {education.location}
          </span>
        )}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <FaCalendarAlt /> {start} - {end}
        {education.gradeOrPercentage && (
          <span className="ml-2">| {education.gradeOrPercentage}</span>
        )}
      </p>
      {education.description && education.description.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200 mt-2">
          {education.description.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
