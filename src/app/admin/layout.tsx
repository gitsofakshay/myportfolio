// app/admin/layout.tsx
import AdminSidebar from '@/components/AdminSidebar';
import '../globals.css';
import { Metadata } from 'next';
import { FiUser, FiLogOut } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Top-right profile and logout */}
      <div className="fixed top-4 right-6 z-[10002] flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full shadow border border-gray-200 dark:border-gray-700">
        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 text-xl">
          <FiUser />
        </span>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </form>
      </div>
      <AdminSidebar />
      <main className="flex-1 p-2 md:p-10 flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
    </div>
  );
}
