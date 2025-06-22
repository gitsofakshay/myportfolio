import React from "react";
import ResumePreview from "@/components/ResumePreview";

export default function ResumePage() {
  return (
    <section className="min-h-screen px-6 md:px-20 py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Resume / CV
      </h2>
      <div className="max-w-6xl mx-auto">
        <ResumePreview />
      </div>
    </section>
  );
}
