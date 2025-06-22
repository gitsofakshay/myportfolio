'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsDisabled(!email || !password || loading);
  }, [email, password, loading]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        router.push('/admin');
      } else {
        setError(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      {loading && <FullPageLoader />}
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Admin Login
        </h2>
        {error && <AlertBar type="error" message={error} />}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex justify-between gap-2 mt-4">
            <button
              className="w-1/2 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={isDisabled}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              className="w-1/2 py-2 px-4 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition"
              onClick={handleChangePassword}
              disabled={loading}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
