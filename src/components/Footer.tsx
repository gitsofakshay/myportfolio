"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 pt-10 pb-5 text-sm text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Contact Info Left */}
          <div className="flex flex-col justify-center md:items-start text-left min-w-[180px]">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">Contact</h4>
            <div className="text-xs text-gray-400">
              <div>
                Email:
                <a href="mailto:akshayraj7067@gmail.com" className="hover:text-blue-400 ml-1">
                  akshayraj7067@gmail.com
                </a>
              </div>
              <div>
                Phone:
                <a href="tel:+919876543210" className="hover:text-blue-400 ml-1">
                  +91 7648924943
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Center */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">Quick Links</h4>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
              <li>
                <a href="#projects" className="hover:text-blue-400 hover:font-bold">
                  Projects
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-blue-400 hover:font-bold">
                  Experience
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-blue-400 hover:font-bold">
                  Skills
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-blue-400 hover:font-bold">
                  Education
                </a>
              </li>
              <li>
                <a href="#certifications" className="hover:text-blue-400 hover:font-bold">
                  Certifications
                </a>
              </li>
              <li>
                <a href="#resume" className="hover:text-blue-400 hover:font-bold">
                  Resume/CV
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 hover:font-bold">
                  About Me
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 hover:font-bold">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links Right */}
          <div className="flex flex-col items-end text-right min-w-[180px]">
            <h4 className="text-lg font-semibold text-gray-100 mb-2">Akshay Raj Kushwaha</h4>
            <div className="flex space-x-4 text-xl mb-2 justify-end">
              <a
                href="https://github.com/gitsofakshay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-blue-400 transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/akshay-raj-kushwaha-402021191"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-400 transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="mailto:akshayraj7067@gmail.com"
                aria-label="Email"
                className="hover:text-blue-400 transition-colors"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Akshay Raj Kushwaha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
