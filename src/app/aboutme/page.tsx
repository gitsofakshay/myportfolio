'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Profile {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  profileImage?: string;
  resumeLink?: string;
}

export default function AboutMe() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; isActive: boolean }[]>([]);

  useEffect(() => {
    fetch('/api/admin/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setProfile(data);
        else setError(data?.error || 'Profile not found');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
    // Fetch active resume
    fetch('/api/admin/resume')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error && data.isActive && data.fileUrl) setResumeUrl(data.fileUrl);
      });
    // Fetch social links
    fetch('/api/admin/social-links')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialLinks(data.filter((l) => l.isActive && l.platform && l.url));
        }
      });
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-10 pb-5 px-2 sm:px-6 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">
        {/* Profile Image */}
        <motion.div
          className="w-36 h-36 sm:w-44 sm:h-44 md:w-60 md:h-60 rounded-full overflow-hidden shadow-lg border-4 border-blue-500 bg-white dark:bg-gray-900 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {profile?.profileImage ? (
            <Image
              src={profile.profileImage}
              alt="Profile Picture"
              width={240}
              height={240}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl bg-gray-100 dark:bg-gray-800">
              <span>?</span>
            </div>
          )}
        </motion.div>

        {/* About Content */}
        <motion.div
          className="text-center md:text-left max-w-2xl"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            About <span className="text-blue-600 dark:text-blue-400">Me</span>
          </h1>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : profile ? (
            <>
              <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                {profile.title}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm md:text-base text-gray-500 dark:text-gray-400 mb-4">
                <span className="bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {profile.fullName}
                </span>
                <span className="bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {profile.location}
                </span>
                <span className="bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {profile.email}
                </span>
                <span className="bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {profile.phone}
                </span>
              </div>
              {/* Social Links and Resume Button */}
              <div className="flex flex-col md:flex-row gap-4 mt-8 items-center justify-center md:justify-start">
                {/* Social Links */}
                <div className="flex flex-wrap gap-3 text-base">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((link) => (
                      <a
                        key={link.platform + link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors font-medium"
                      >
                        {link.platform}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">No social links available.</span>
                  )}
                </div>
                {/* Resume Link Button */}
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-base shadow"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
