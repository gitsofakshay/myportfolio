import React from "react";
import { FaExternalLinkAlt, FaCertificate, FaCalendarAlt, FaUniversity } from "react-icons/fa";

interface CertificationCardProps {
  certification: {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    doesNotExpire?: boolean;
    credentialId?: string;
    credentialUrl?: string;
    certificateImage?: string;
    certificateImagePublicId?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  // Format date
  const issueDate = certification.issueDate
    ? new Date(certification.issueDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "-";
  const expirationDate = certification.expirationDate
    ? new Date(certification.expirationDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : certification.doesNotExpire
    ? "No Expiry"
    : "-";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8 hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-1">
        <FaCertificate className="text-blue-400" /> {certification.name}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
        <FaUniversity className="text-green-500" /> {certification.issuingOrganization}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <FaCalendarAlt /> {issueDate}
        {certification.expirationDate || certification.doesNotExpire ? (
          <span className="ml-2">| Expiry: {expirationDate}</span>
        ) : null}
      </p>
      {certification.certificateImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={certification.certificateImage}
          alt="Certificate"
          className="w-full max-w-xs rounded-lg shadow mb-3 border border-gray-200 dark:border-gray-700"
        />
      )}
      {certification.credentialUrl && (
        <a
          href={certification.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400 mt-2"
        >
          View Certificate <FaExternalLinkAlt size={12} />
        </a>
      )}
    </div>
  );
}
