'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

interface Skill {
  _id?: string;
  name: string;
  level: string;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Skill>({ name: '', level: '' });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/skills');
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        setAlert({ type: 'error', message: 'Failed to fetch skills' });
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Add or update skill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/skills${form._id ? `/${form._id}` : ''}`, {
        method: form._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = await res.json();
      setSkills((prev) =>
        form._id
          ? prev.map((s) => (s._id === updated._id ? updated : s))
          : [...prev, updated]
      );
      setAlert({ type: 'success', message: `Skill ${form._id ? 'updated' : 'added'}!` });
      setForm({ name: '', level: '' });
    } catch {
      setAlert({ type: 'error', message: 'Error saving skill' });
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setSkills((prev) => prev.filter((s) => s._id !== id));
      setAlert({ type: 'success', message: 'Skill deleted!' });
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    } finally {
      setLoading(false);
    }
  };

  // Set form for editing
  const handleEdit = (skill: Skill) => setForm(skill);
  const handleCancel = () => setForm({ name: '', level: '' });

  return (
    <div className="max-w-2xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6">Manage Skills</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Skill Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="flex-1">
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {form._id ? <FiCheck /> : <FiCheck />} {form._id ? 'Update' : 'Add'}
          </button>
          {form._id && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-3">
        {skills.map((skill) => (
          <li key={skill._id} className="flex justify-between items-center border p-2 rounded bg-gray-50 dark:bg-gray-700">
            <span className="font-medium">{skill.name} <span className="text-xs text-gray-500">({skill.level})</span></span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => skill._id && handleDelete(skill._id)}
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
