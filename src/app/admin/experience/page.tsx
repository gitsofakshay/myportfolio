'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description: string[];
}

const initialForm: Experience = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: [],
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<Experience>(initialForm);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch experiences
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/experience');
        const data = await res.json();
        setExperiences(Array.isArray(data) ? data : []);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load experiences' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        description: Array.isArray(form.description)
          ? form.description.map((d: string) => d.trim()).filter(Boolean)
          : String(form.description).split('\n').map((d: string) => d.trim()).filter(Boolean),
      };
      let res;
      if (editId) {
        res = await fetch(`/api/admin/experience/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();
      setExperiences((prev) =>
        editId
          ? prev.map((exp) => (exp._id === updated._id ? updated : exp))
          : [...prev, updated]
      );
      setAlert({ type: 'success', message: editId ? 'Experience updated' : 'Experience added' });
      setForm(initialForm);
      setEditId(null);
    } catch {
      setAlert({ type: 'error', message: 'Error saving experience' });
    } finally {
      setLoading(false);
    }
  };

  // Delete experience 
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      setAlert({ type: 'success', message: 'Experience deleted' });
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditId(exp._id || null);
    setForm({
      ...exp,
      description: Array.isArray(exp.description) ? exp.description : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
  };

  return (
    <div className="max-w-3xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6">Manage Experience</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location || ''}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={form.endDate || ''}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full border p-2 rounded"
            disabled={form.currentlyWorking}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.currentlyWorking}
              onChange={(e) => setForm({ ...form, currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : form.endDate })}
            />
            Currently Working
          </label>
        </div>
        <textarea
          rows={4}
          placeholder="Description (one bullet per line)"
          value={Array.isArray(form.description) ? form.description.join('\n') : ''}
          onChange={(e) => setForm({ ...form, description: e.target.value.split('\n') })}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {editId ? <FiCheck /> : <FiCheck />} {editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {experiences.map((exp) => (
          <li key={exp._id} className="border p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-gray-700">
            <div className="flex-1">
              <h2 className="font-bold text-lg">{exp.title} @ {exp.company}</h2>
              <p className="text-sm text-gray-500">{exp.location}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} — {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present')}
              </p>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {Array.isArray(exp.description) && exp.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(exp)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => exp._id && handleDelete(exp._id)}
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
