"use client";

import { FiUser, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminProfileLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-6 z-[10002] flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full shadow border border-gray-200 dark:border-gray-700">
      <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 text-xl">
        <FiUser />
      </span>
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
          title="Logout"
          disabled={loading}
        >
          <FiLogOut size={20} />
        </button>
      </form>
    </div>
  );
}
