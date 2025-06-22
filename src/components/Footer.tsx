"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/social-links")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialLinks(
            data.filter((l) => l.isActive && l.icon && typeof (FaIcons as any)[l.icon] === "function")
          );
        }
      });
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700  pt-10 pb-5 text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Contact
            </h4> 
            <p>
              Email:{" "}
              <a
                href="mailto:akshay@email.com"
                className="text-blue-600 hover:underline"
              >
                akshayraj7067@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+918888888888"
                className="text-blue-600 hover:underline"
              >
                +91 7648924943
              </a>
            </p>
            <p>Address: Satna, Madhya Pradesh, India</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Links
            </h4>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
              <li>
                <a href="#projects" className="hover:text-blue-500 hover:font-bold">
                  Projects
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-blue-500 hover:font-bold">
                  Experience
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-blue-500 hover:font-bold">
                  Skills
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-blue-500 hover:font-bold">
                  Education
                </a>
              </li>
              <li>
                <a href="#certifications" className="hover:text-blue-500 hover:font-bold">
                  Certifications
                </a>
              </li>
              <li>
                <a href="#resume" className="hover:text-blue-500 hover:font-bold">
                  Resume/CV
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-500 hover:font-bold">
                  About Me
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-500 hover:font-bold">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Social
            </h4>
            <div className="flex space-x-4 text-xl">
              {socialLinks.map((link) => {
                const Icon = (FaIcons as any)[link.icon];
                return Icon ? (
                  <a
                    key={link._id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title={link.platform}
                  >
                    <Icon />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p>
            © {new Date().getFullYear()} Akshay Raj Kushwaha. All rights
            reserved.
          </p>          
        </div>
      </div>
    </footer>
  );
}
