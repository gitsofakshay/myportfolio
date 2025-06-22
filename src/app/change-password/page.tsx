'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

export default function ChangePassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(true);
    setAlert(null);
    try {
      // 1. Send OTP to email
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to send OTP');
      // 2. Store email and newPassword in localStorage (for verify-otp step)
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetNewPassword', newPassword);
      setAlert({ type: 'success', message: 'OTP sent to your email.' });
      setTimeout(() => router.push('/verify-otp'), 1000);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Change Password
        </h2>
        {alert && <AlertBar type={alert.type} message={alert.message} />}
        {loading && <FullPageLoader />}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e)=> {
                setEmail(e.target.value)
            }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPassword}
              onChange={(e) => {                
                setNewPassword(e.target.value)                
            }}
            />
          </div>
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleProceed}
            disabled={!email || !newPassword || loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      </div>
    </section>
  );
}
