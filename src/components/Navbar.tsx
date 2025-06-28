"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Akshay Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold text-gray-100">Akshay.dev</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 hidden md:block">
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

        {/* Static Social Icons */}
        <div className="flex items-center space-x-4 text-xl">
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
        </div>
      </div>
    </header>
  );
}
