"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

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

  useEffect(() => {
    fetch("/api/admin/social-links")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialLinks(
            data.filter((l) => l.isActive && l.icon && (FaIcons as any)[l.icon] || (MdIcons as any)[l.icon])
          );
        }
      });
  }, []);

  const iconPacks: Record<string, React.ComponentType<any>> = { ...FaIcons, ...MdIcons };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
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
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Akshay.dev
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 hidden md:block">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-blue-600 transition-colors ${
                pathname === link.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex items-center space-x-4 text-xl">
          {socialLinks.map((link) => {
            const Icon = iconPacks[link.icon as string];
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
