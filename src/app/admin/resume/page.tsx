'use client';

import { useState, useEffect, useRef } from 'react';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';
import { FiUpload, FiTrash2, FiCheck, FiX, FiEye, FiStar } from 'react-icons/fi';

interface Resume {
  _id?: string;
  fileUrl: string;
  fileName: string;
  publicId?: string;
  uploadedAt?: string;
  isActive?: boolean;
}

export default function AdminResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resume');
      const data = await res.json();
      setResumes(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      setAlert({ type: 'error', message: 'Failed to load resumes' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setFileName(f?.name || '');
  };

  // Upload new resume
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      if (!file) {
        setAlert({ type: 'error', message: 'Please select a resume file' });
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('resume', file);
      let res;
      if (editId) {
        formData.append('fileName', fileName);
        formData.append('isActive', 'true');
        res = await fetch(`/api/admin/resume/${editId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch('/api/admin/resume', {
          method: 'POST',
          body: formData,
        });
      }
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: 'success', message: editId ? 'Resume updated!' : 'Resume uploaded!' });
        fetchResumes();
        resetForm();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to save resume' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to save resume' });
    } finally {
      setLoading(false);
    }
  };

  // Activate a resume
  const handleActivate = async (id: string, fileName: string) => {
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      formData.append('fileName', fileName);
      formData.append('isActive', 'true');
      const res = await fetch(`/api/admin/resume/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: 'success', message: 'Resume activated!' });
        fetchResumes();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to activate resume' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to activate resume' });
    } finally {
      setLoading(false);
    }
  };

  // Delete a resume
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`/api/admin/resume/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: 'success', message: 'Resume deleted!' });
        fetchResumes();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to delete resume' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to delete resume' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6">Manage Resume/CV</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col gap-4" encType="multipart/form-data">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <FiUpload className="text-blue-500" />
          {fileName && <span className="ml-2 text-xs text-gray-600">{fileName}</span>}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {editId ? <FiCheck /> : <FiUpload />} {editId ? 'Update Resume' : 'Upload Resume'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-4">All Resumes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Uploaded</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 font-medium">
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <FiEye /> {resume.fileName}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleString() : ''}
                  </td>
                  <td className="px-4 py-2">
                    {resume.isActive ? <FiStar className="text-yellow-500" title="Active" /> : ''}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {!resume.isActive && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleActivate(resume._id!, resume.fileName)}
                        title="Set as Active"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(resume._id!)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
