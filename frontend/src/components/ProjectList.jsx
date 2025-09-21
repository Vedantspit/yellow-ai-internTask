import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function ProjectList({ selectedProject, setSelectedProject }) {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectPrompt, setNewProjectPrompt] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
      if (!selectedProject && res.data.length > 0)
        setSelectedProject(res.data[0]);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const createProject = async () => {
    if (!newProjectName) return;
    try {
      const res = await api.post("/projects", {
        name: newProjectName,
        prompt: newProjectPrompt,
      });
      setProjects([...projects, res.data]);
      setNewProjectName("");
      setNewProjectPrompt("");
      setSelectedProject(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !selectedProject) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        `/files/${selectedProject._id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === selectedProject._id
            ? { ...p, files: res.data.project.files }
            : p
        )
      );
      alert("📎 File uploaded successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("File upload failed");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col h-full p-3 bg-gray-50 rounded-lg shadow-md">
      {/* Project title */}
      <h2 className="font-bold mb-2 text-lg text-gray-700">Projects</h2>

      {/* New Project Form */}
      <div className="mb-2 flex flex-col gap-1">
        <input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Project Name"
          className="border p-1.5 rounded w-full focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <textarea
          value={newProjectPrompt}
          onChange={(e) => setNewProjectPrompt(e.target.value)}
          placeholder="Optional: Project Prompt / Description"
          className="border p-1.5 rounded w-full h-16 resize-none focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={createProject}
          className="bg-green-500 text-white font-semibold py-1.5 rounded hover:bg-green-600 transition-colors text-sm"
        >
          Create Project
        </button>
      </div>

      {/* Projects List */}
      <ul className="flex-1 overflow-auto mb-2">
        {projects.map((p) => (
          <li
            key={p._id}
            onClick={() => setSelectedProject(p)}
            className={`cursor-pointer p-1.5 rounded mb-1 text-sm ${
              selectedProject?._id === p._id
                ? "bg-blue-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {p.name}
          </li>
        ))}
      </ul>

      {/* File Upload (closer to top now) */}
      {selectedProject && (
        <div className="mb-2">
          <h3 className="font-semibold text-sm">Attach File (PDF/CSV)</h3>
          <input
            type="file"
            accept=".pdf,.csv"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="mt-1 border rounded px-2 py-1 text-xs w-full cursor-pointer"
          />
          {selectedProject?.files?.length > 0 && (
            <ul className="mt-1 text-xs text-gray-600 max-h-20 overflow-auto">
              {selectedProject.files.map((f, idx) => (
                <li key={idx}>📎 {f.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Logout Button (moved up) */}
      <div className="mb-2">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="w-full bg-red-500 text-white font-semibold py-1.5 rounded hover:bg-red-600 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
