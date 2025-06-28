'use client';

import { useEffect, useRef, useState } from 'react';
import AlertBar from '@/components/Alert';
import FullPageLoader from '@/components/Loader';
import { FiEdit, FiTrash2, FiCheck, FiX, FiUpload, FiExternalLink } from 'react-icons/fi';

interface Certification {
  _id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  doesNotExpire?: boolean;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  certificateImagePublicId?: string;
}

const initialForm: Certification = {
  name: '',
  issuingOrganization: '',
  issueDate: '',
  expirationDate: '',
  doesNotExpire: false,
  credentialId: '',
  credentialUrl: '',
  certificateImage: '',
  certificateImagePublicId: '',
};

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [form, setForm] = useState<Certification>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certifications');
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch {
      setAlert({ type: 'error', message: 'Failed to fetch certifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('issuingOrganization', form.issuingOrganization);
      formData.append('issueDate', form.issueDate);
      if (form.expirationDate) formData.append('expirationDate', form.expirationDate);
      formData.append('doesNotExpire', String(form.doesNotExpire));
      if (form.credentialId) formData.append('credentialId', form.credentialId);
      if (form.credentialUrl) formData.append('credentialUrl', form.credentialUrl);
      if (editId && form.certificateImage) formData.append('existingImage', form.certificateImage);
      if (editId && form.certificateImagePublicId) formData.append('existingImagePublicId', form.certificateImagePublicId);
      if (imageFile) formData.append('certificateImage', imageFile);
      let res;
      if (editId) {
        res = await fetch(`/api/admin/certifications/${editId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch('/api/admin/certifications', {
          method: 'POST',
          body: formData,
        });
      }
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: 'success', message: editId ? 'Certification updated!' : 'Certification added!' });
        fetchCerts();
        resetForm();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to save certification' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to save certification' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditId(cert._id || null);
    setForm({ ...cert });
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: 'success', message: 'Certification deleted!' });
        fetchCerts();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to delete certification' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to delete certification' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full min-h-[60vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-6">Manage Certifications</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col gap-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Certification Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Issuing Organization"
          value={form.issuingOrganization}
          onChange={(e) => setForm({ ...form, issuingOrganization: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={form.expirationDate || ''}
            onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            className="w-full border p-2 rounded"
            disabled={form.doesNotExpire}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.doesNotExpire}
              onChange={(e) => setForm({ ...form, doesNotExpire: e.target.checked, expirationDate: e.target.checked ? '' : form.expirationDate })}
            />
            Does Not Expire
          </label>
        </div>
        <input
          type="text"
          placeholder="Credential ID"
          value={form.credentialId || ''}
          onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          placeholder="Credential URL"
          value={form.credentialUrl || ''}
          onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <FiUpload className="text-blue-500" />
          {form.certificateImage && !imageFile && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.certificateImage} alt="Certificate" className="w-16 h-16 object-contain rounded border ml-2" />
          )}
        </div>
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
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {certs.map((cert) => (
          <li key={cert._id} className="border p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-gray-700">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
              {cert.certificateImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cert.certificateImage} alt="Certificate" className="w-20 h-20 object-contain rounded border" />
              )}
              <div>
                <h2 className="font-bold text-lg">{cert.name}</h2>
                <p className="text-sm text-gray-500">{cert.issuingOrganization}</p>
                <p className="text-sm text-gray-500">
                  {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : ''} — {cert.doesNotExpire ? 'No Expiry' : (cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : 'No Expiry')}
                </p>
                {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    className="text-blue-500 hover:underline flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiExternalLink /> Credential
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(cert)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => cert._id && handleDelete(cert._id)}
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
