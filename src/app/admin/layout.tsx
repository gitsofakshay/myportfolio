// app/admin/layout.tsx
import AdminSidebar from '@/components/AdminSidebar';
import AdminProfileLogout from '@/components/AdminProfileLogout';
import '../globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Top-right profile and logout */}
      <AdminProfileLogout />
      <AdminSidebar />
      <main className="flex-1 p-2 md:p-10 flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
    </div>
  );
}
