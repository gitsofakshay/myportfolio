'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX, FiLink, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
  icon?: string;
  isActive?: boolean;
}

const initialForm: SocialLink = { platform: '', url: '', icon: '', isActive: true };

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [form, setForm] = useState<SocialLink>(initialForm);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch social links
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch {
      setAlert({ type: 'error', message: 'Failed to fetch links.' });
    } finally {
      setLoading(false);
    }
  };

  // Add or Update Link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const endpoint = editId ? `/api/admin/social-links/${editId}` : '/api/admin/social-links';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updatedLink = await res.json();
      if (!res.ok || updatedLink.error) throw new Error(updatedLink.error || 'Failed to save link');
      setLinks((prev) =>
        editId
          ? prev.map((link) => (link._id === updatedLink._id ? updatedLink : link))
          : [...prev, updatedLink]
      );
      setForm(initialForm);
      setEditId(null);
      setAlert({ type: 'success', message: `Link ${editId ? 'updated' : 'added'} successfully.` });
    } catch (err) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Failed to save link.' });
    } finally {
      setLoading(false);
    }
  };

  // Edit link
  const handleEdit = (link: SocialLink) => {
    setEditId(link._id || null);
    setForm({ ...link });
  };
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
  };

  // Delete Link
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social-links/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to delete link');
      setLinks((prev) => prev.filter((link) => link._id !== id));
      setAlert({ type: 'success', message: 'Link deleted successfully.' });
    } catch (err: unknown) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Failed to delete link.' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle isActive
  const handleToggleActive = async (link: SocialLink) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social-links/${link._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to update status');
      setLinks((prev) => prev.map((l) => (l._id === link._id ? { ...l, isActive: !link.isActive } : l)));
    } catch (err: unknown) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update status.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Manage Social Links</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Platform"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="url"
              placeholder="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Icon (optional)"
              value={form.icon || ''}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <label className="text-sm">Active</label>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
              className="text-xl"
              title={form.isActive ? 'Deactivate' : 'Activate'}
            >
              {form.isActive ? <FiToggleRight className="text-green-500" /> : <FiToggleLeft className="text-gray-400" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            {editId ? <FiCheck /> : <FiCheck />} {editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-2 rounded bg-gray-50 dark:bg-gray-700 gap-2">
            <div className="flex flex-col gap-1 w-full">
              <span className="font-medium flex items-center gap-2">
                <FiLink /> {link.platform}
                {link.isActive ? <FiToggleRight className="text-green-500 ml-2" title="Active" /> : <FiToggleLeft className="text-gray-400 ml-2" title="Inactive" />}
              </span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center gap-1 break-all">
                <FiEye /> {link.url}
              </a>
              {link.icon && <span className="text-xs text-gray-500">Icon: {link.icon}</span>}
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleEdit(link)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleToggleActive(link)}
                className="text-green-600 hover:text-green-800 p-1 rounded"
                title={link.isActive ? 'Deactivate' : 'Activate'}
              >
                {link.isActive ? <FiToggleLeft /> : <FiToggleRight />}
              </button>
              <button
                onClick={() => link._id && handleDelete(link._id)}
                className="text-red-600 hover:text-red-800 p-1 rounded"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
