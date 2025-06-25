"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaStar, FaTimes } from "react-icons/fa";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  video?: { secure_url: string };
  isFeatured?: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        else setError(data?.error || "Failed to load projects");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);

  // Handle fullscreen close
  useEffect(() => {
    if (!modalVideo) return;
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      // If exited fullscreen and modal is open, allow closing
      if (!isFullscreen && modalVideo) {
        // No-op, just allow close button to work
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [modalVideo]);

  // Helper to close modal, exiting fullscreen if needed
  const handleCloseModal = () => {
    const v = videoRef.current;
    if (v) {
      // Try to exit fullscreen on the document, not just the video
      const isFullscreen =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      if (isFullscreen) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
        else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
        else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
        setTimeout(() => setModalVideo(null), 200);
        return;
      }
    }
    setModalVideo(null);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-2 sm:px-6 py-10 w-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 flex items-center justify-center gap-2">
        Projects <FaStar className="text-yellow-400 mb-1" />
      </h2>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      ) : (
        <div className="grid gap-10 md:gap-12 lg:grid-cols-2">
          {[...projects]
            .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
            .map((project, idx) => (
              <motion.div
                key={project._id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative bg-white/80 dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col gap-3 hover:shadow-2xl transition-shadow duration-300 ${
                  project.isFeatured ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                {project.isFeatured && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
                    <FaStar className="text-yellow-400" /> Featured
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {project.description}
                </p>
                <div className="mb-2 flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Video Preview (autoplay, muted, loop, no controls) */}
                {project.video?.secure_url && (
                  <video
                    src={project.video.secure_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full rounded-md mb-2 border border-gray-200 dark:border-gray-700 max-h-64 object-cover cursor-pointer"
                    preload="metadata"
                    style={{ objectFit: "cover" }}
                    onClick={() => setModalVideo(project.video!.secure_url)}
                    title="Click to view full video"
                  />
                )}
                {/* Full Video with controls (optional, can be on click/expand) */}
                {/*
                {project.video?.secure_url && (
                  <video
                    src={project.video.secure_url}
                    controls
                    className="w-full rounded-md mb-2 border border-gray-200 dark:border-gray-700"
                    preload="metadata"
                  />
                )}
                */}
                <div className="flex gap-4 mt-2">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    <FaGithub /> GitHub
                  </a>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:underline hover:text-green-800 dark:hover:text-green-200 transition-colors"
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                </div>
              </motion.div>
            ))}
        </div>
      )}
      {/* Video Modal */}
      {modalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative w-full max-w-3xl p-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl bg-red-600 bg-opacity-90 rounded-full p-3 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 z-50 border-2 border-white"
              onClick={handleCloseModal}
              aria-label="Close video"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              <FaTimes />
            </button>
            <video
              ref={videoRef}
              src={modalVideo}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-lg border border-gray-200 dark:border-gray-700 bg-black"
              style={{ background: "black" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
