"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Experience", href: "/experience" },
    { name: "Skills", href: "/skills" },
    { name: "Education", href: "/education" },
    { name: "Certifications", href: "/certifications" },
    { name: "Resume/CV", href: "/resume-cv" },
    { name: "About Me", href: "/aboutme" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center gap-2 min-w-fit">
          <Image
            src="/logo.png"
            alt="Akshay Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold text-gray-100 hidden sm:inline">
            Akshay.dev
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="space-x-6 hidden md:block flex-1 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-blue-400 transition-colors ${
                pathname === link.href
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons, Admin Login, Hamburger */}
        <div className="flex items-center space-x-4 text-xl min-w-fit">
          <a
            href="https://github.com/gitsofakshay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-200 hover:text-blue-400 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/akshay-raj-kushwaha-402021191"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-200 hover:text-blue-400 transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:akshayraj7067@gmail.com"
            aria-label="Email"
            className="text-gray-200 hover:text-blue-400 transition-colors"
          >
            <FaEnvelope />
          </a>
          <Link
            href="/login"
            className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
          >
            Admin Login
          </Link>
          {/* Hamburger for mobile, always at the end */}
          <button
            className="md:hidden text-gray-200 text-2xl ml-2 focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-900 border-t border-gray-700 px-4 pb-4 pt-2 animate-fade-in-down">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-2 py-2 rounded hover:bg-gray-800 hover:text-blue-400 transition-colors ${
                  pathname === link.href
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
