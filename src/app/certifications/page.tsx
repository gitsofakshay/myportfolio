"use client";

import React, { useEffect, useState } from "react";
import CertificationCard from "@/components/CertificationCard";
import { FaCertificate } from "react-icons/fa";

interface Certification {
  _id: string;
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
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/certifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCertifications(data);
        else setError(data?.error || "Failed to load certifications");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load certifications");
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen px-2 sm:px-6 md:px-20 py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 flex items-center justify-center gap-2">
        <FaCertificate className="text-blue-600 dark:text-blue-400 mb-1" /> Certifications
      </h2>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          {certifications.length > 0 ? (
            certifications.map((cert) => (
              <CertificationCard key={cert._id} certification={cert} />
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">No certifications found.</p>
          )}
        </div>
      )}
    </section>
  );
}
