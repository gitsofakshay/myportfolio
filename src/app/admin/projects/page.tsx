"use client";

import { useState, useEffect, useRef } from "react";
import AlertBar from "@/components/Alert";
import FullPageLoader from "@/components/Loader";
import { FiEdit, FiTrash2, FiUpload, FiVideo, FiExternalLink, FiGithub } from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  video?: { secure_url: string };
  isFeatured: boolean;
}

const initialForm = {
  title: "",
  description: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  isFeatured: false,
  video: null as File | null,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setAlert({ type: "error", message: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  // Handle video file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, video: file }));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Add or update project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("techStack", form.techStack);
      formData.append("githubLink", form.githubLink);
      formData.append("liveLink", form.liveLink);
      formData.append("isFeatured", String(form.isFeatured));
      if (form.video) formData.append("video", form.video);
      let res;
      if (editId) {
        res = await fetch(`/api/admin/projects/${editId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          body: formData,
        });
      }
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: "success", message: editId ? "Project updated!" : "Project added!" });
        fetchProjects();
        resetForm();
      } else {
        setAlert({ type: "error", message: data.error || "Failed to save project" });
      }
    } catch {
      setAlert({ type: "error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // Edit project
  const handleEdit = (project: Project) => {
    setEditId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      isFeatured: project.isFeatured,
      video: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && !data.error) {
        setAlert({ type: "success", message: "Project deleted!" });
        fetchProjects();
      } else {
        setAlert({ type: "error", message: data.error || "Failed to delete project" });
      }
    } catch {
      setAlert({ type: "error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl w-full min-h-[80vh] mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-md mt-8 flex flex-col gap-10">
      <h1 className="text-2xl font-bold mb-6">{editId ? "Edit Project" : "Add New Project"}</h1>
      {alert && <AlertBar type={alert.type} message={alert.message} />}
      {loading && <FullPageLoader />}
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">GitHub Link</label>
            <input
              type="url"
              name="githubLink"
              value={form.githubLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Live Link</label>
            <input
              type="url"
              name="liveLink"
              value={form.liveLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Project Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="block font-medium mb-1">Project Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <FiUpload className="text-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label>Mark as Featured</label>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {editId ? <FiEdit /> : <FiUpload />} {editId ? "Update Project" : "Save Project"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Project List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Tech Stack</th>
                <th className="px-4 py-2 text-left">Links</th>
                <th className="px-4 py-2 text-left">Video</th>
                <th className="px-4 py-2 text-left">Featured</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 font-medium">{proj.title}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-200 hover:text-blue-600" title="GitHub">
                      <FiGithub />
                    </a>
                    <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-200 hover:text-blue-600" title="Live Demo">
                      <FiExternalLink />
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {proj.video?.secure_url ? (
                      <a href={proj.video.secure_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center gap-1" title="View Video">
                        <FiVideo /> <span className="hidden md:inline">Video</span>
                      </a>
                    ) : (
                      <span className="text-gray-400">No Video</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {proj.isFeatured ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(proj)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(proj._id)}
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
