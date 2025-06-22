'use client';

import { useEffect, useState, useRef } from 'react';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

interface ProfileData {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  profileImage: string;
}

export default function AdminAboutPage() {
  const [data, setData] = useState<ProfileData>({
    fullName: '',
    title: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    profileImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch existing profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const json = await res.json();
        if (json && !json.error) {
          setData({
            fullName: json.fullName || '',
            title: json.title || '',
            bio: json.bio || '',
            location: json.location || '',
            email: json.email || '',
            phone: json.phone || '',
            profileImage: json.profileImage || '',
          });
        }
      } catch (err) {
        setAlert({ type: 'error', message: 'Failed to load profile data' });
      }
    };
    fetchData();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append('profileImage', imageFile);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && !json.error) {
        setAlert({ type: 'success', message: 'Profile updated!' });
        setData((prev) => ({ ...prev, profileImage: json.profileImage || prev.profileImage }));
      } else {
        setAlert({ type: 'error', message: json.error || 'Update failed' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setData((prev) => ({ ...prev, profileImage: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl w-full min-h-[80vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col justify-center">
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      <h1 className="text-2xl font-bold mb-6">Edit Profile / About Me</h1>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Bio</label>
              <textarea
                value={data.bio}
                onChange={(e) => setData((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full mt-4"
        >
          {loading ? <FullPageLoader /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
