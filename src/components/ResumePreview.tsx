import React, { useEffect, useState } from "react";
import { FaDownload, FaFilePdf, FaExclamationTriangle } from "react-icons/fa";

const ResumePreview = () => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Resume.pdf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/resume")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.fileUrl) {
          setResumeUrl(data.fileUrl);
          setFileName(data.fileName || "Resume.pdf");
        } else {
          setError(data?.error || "No resume found");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load resume");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-20">
        <FaFilePdf className="text-5xl text-blue-500 animate-pulse" />
        <p className="text-gray-600 dark:text-gray-300">Loading resume...</p>
      </div>
    );
  }
  if (error || !resumeUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-20">
        <FaExclamationTriangle className="text-5xl text-red-500" />
        <p className="text-red-500 dark:text-red-400">{error || "No resume found."}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaFilePdf className="text-blue-500" /> Download My Resume
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl">
          View or download my most recent resume as a PDF file. It contains my experience,
          skills, projects, and education details.
        </p>

        <a
          href={resumeUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <FaDownload className="mr-2" />
          Download Resume
        </a>

        <iframe
          src={resumeUrl}
          className="w-full h-[800px] rounded-lg mt-6 border dark:border-gray-700"
          title="Resume Preview"
        ></iframe>
      </div>
    </div>
  );
};

export default ResumePreview;
