"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiUser, FiFolder, FiAward, FiBook, FiBriefcase, FiFileText, FiLink, FiLogOut } from "react-icons/fi";

const navLinks = [
  { href: "/admin/about", label: "About", icon: <FiUser /> },
  { href: "/admin/projects", label: "Projects", icon: <FiFolder /> },
  { href: "/admin/skills", label: "Skills", icon: <FiAward /> },
  { href: "/admin/experience", label: "Experience", icon: <FiBriefcase /> },
  { href: "/admin/education", label: "Education", icon: <FiBook /> },
  { href: "/admin/certifications", label: "Certifications", icon: <FiAward /> },
  { href: "/admin/resume", label: "Resume", icon: <FiFileText /> },
  { href: "/admin/social-links", label: "Social Links", icon: <FiLink /> },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const activeClass =
    "bg-blue-900 text-blue-100 dark:bg-blue-900 dark:text-blue-100 font-semibold shadow-inner";
  const baseClass =
    "flex items-center gap-3 px-2 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition";

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-[10001] p-2 rounded bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin navigation"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar for desktop */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-white dark:bg-gray-800 shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  baseClass + (isActive(link.href) ? ` ${activeClass}` : "")
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="mt-10 w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FiLogOut /> Logout
          </button>
        </form>
      </aside>

      {/* Sidebar Drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[10000] flex">
          <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col justify-between animate-slideInLeft">
            <div>
              <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      baseClass + (isActive(link.href) ? ` ${activeClass}` : "")
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="mt-10 w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                <FiLogOut /> Logout
              </button>
            </form>
          </div>
          {/* Overlay to close drawer */}
          <div
            className="flex-1 bg-black/40 dark:bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
}
