'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying?: boolean;
  gradeOrPercentage?: string;
  description: string[];
}

const initialForm: Education = {
  degree: '',
  institution: '',
  fieldOfStudy: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyStudying: false,
  gradeOrPercentage: '',
  description: [],
};

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [form, setForm] = useState<Education>(initialForm);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch education records
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/education');
        const data = await res.json();
        setEducations(Array.isArray(data) ? data : []);
      } catch {
        setAlert({ type: 'error', message: 'Failed to fetch education details' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
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
        res = await fetch(`/api/admin/education/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setEducations((prev) =>
        editId
          ? prev.map((edu) => (edu._id === updated._id ? updated : edu))
          : [...prev, updated]
      );
      setAlert({ type: 'success', message: editId ? 'Updated successfully' : 'Added successfully' });
      setForm(initialForm);
      setEditId(null);
    } catch {
      setAlert({ type: 'error', message: 'Failed to save education' });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit 
  const handleEdit = (edu: Education) => {
    setEditId(edu._id || null);
    setForm({
      ...edu,
      description: Array.isArray(edu.description) ? edu.description : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setEducations((prev) => prev.filter((edu) => edu._id !== id));
      setAlert({ type: 'success', message: 'Deleted successfully' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to delete education' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6">Manage Education</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Degree"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Institution"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Field of Study"
          value={form.fieldOfStudy || ''}
          onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
          className="w-full border p-2 rounded"
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
            disabled={form.currentlyStudying}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.currentlyStudying}
              onChange={(e) => setForm({ ...form, currentlyStudying: e.target.checked, endDate: e.target.checked ? '' : form.endDate })}
            />
            Currently Studying
          </label>
        </div>
        <input
          type="text"
          placeholder="Grade or Percentage"
          value={form.gradeOrPercentage || ''}
          onChange={(e) => setForm({ ...form, gradeOrPercentage: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          rows={4}
          placeholder="Description (one bullet per line)"
          value={Array.isArray(form.description) ? form.description.join('\n') : ''}
          onChange={(e) => setForm({ ...form, description: e.target.value.split('\n') })}
          className="w-full border p-2 rounded"
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
        {educations.map((edu) => (
          <li key={edu._id} className="border p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-gray-700">
            <div className="flex-1">
              <h2 className="font-bold text-lg">{edu.degree} {edu.fieldOfStudy && <span className="font-normal">({edu.fieldOfStudy})</span>}</h2>
              <p className="text-sm text-gray-500">{edu.institution} {edu.location && <>— {edu.location}</>}</p>
              <p className="text-sm text-gray-500">
                {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''} — {edu.currentlyStudying ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present')}
              </p>
              {edu.gradeOrPercentage && <p className="text-sm text-gray-500">Grade: {edu.gradeOrPercentage}</p>}
              <ul className="list-disc ml-5 mt-2 text-sm">
                {Array.isArray(edu.description) && edu.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(edu)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => edu._id && handleDelete(edu._id)}
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
