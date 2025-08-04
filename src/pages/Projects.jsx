import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { FaUserCircle, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons
//import LenisScrollWrapper from '../components/LenisScrollWrapper';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [verifyClientName, setVerifyClientName] = useState('');
  const [form, setForm] = useState({
    clientName: '',
    description: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get('/api/projects', { headers });
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post('/api/projects', form, { headers });
      setProjects([res.data, ...projects]);
      setShowModal(false);
      setForm({ clientName: '', description: '' }); // Reset form
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project');
    }
  };

  const handleEditProject = (project) => {
    setEditingId(project._id);
    setForm({
      clientName: project.clientName || '',
      description: project.description || '',
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.put(`/api/projects/${editingId}`, form, { headers });
      setProjects(projects.map((p) => (p._id === editingId ? res.data : p)));
      setEditingId(null);
      setForm({ clientName: '', description: '' }); // Reset form
    } catch (err) {
      alert('Failed to update project');
    }
  };

  const confirmDeleteProject = async (projectId, clientNameForConfirmation) => {
    if (verifyClientName !== clientNameForConfirmation) {
      alert('Client name mismatch. Please type the client name exactly.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`/api/projects/${projectId}`, { headers });
      setProjects(projects.filter((p) => p._id !== projectId));
      setDeleteConfirmation('');
      setVerifyClientName(''); // Reset verification input
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
  //  <LenisScrollWrapper>
    <div className="p-4 sm:p-6" style={{ backgroundColor: '#ffffffff', minHeight: '100vh' }}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0" style={{ color: '#1F2937' }}>Your Projects</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2  cursor-pointer text-base sm:text-lg"
          style={{ backgroundColor: '#F4A100', color: '#FFFFFF', hover: { backgroundColor: '#E09000' } }}
        >
          + Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="relative border rounded-sm shadow-sm overflow-hidden min-h-[18rem] flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            {editingId === project._id ? (
              <form onSubmit={handleUpdateProject} className="p-5 space-y-3 flex flex-col justify-center flex-grow">
                <input
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  className="w-full p-2 border rounded-sm focus:border-none focus:ring-1 focus:ring-yellow-500"
                  style={{ color: '#1F2937' }}
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description (e.g., Video Editor)"
                  className="w-full p-2 border rounded-sm focus:border-none focus:ring-1 focus:ring-yellow-500 min-h-[5rem]"
                  style={{ color: '#1F2937' }}
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="submit" className="px-4 py-2 rounded-md transition duration-200" style={{ backgroundColor: '#F4A100', color: '#FFFFFF', hover: { backgroundColor: '#E09000' } }}>Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 rounded-md transition duration-200" style={{ backgroundColor: '#E5E7EB', color: '#1F2937', hover: { backgroundColor: '#D1D5DB' } }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div
                  className="p-5 flex flex-col items-center justify-center text-center cursor-pointer transition duration-200 ease-in-out flex-grow"
                  style={{ hover: { backgroundColor: '#F9FAFB' } }}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <FaUserCircle className="text-6xl mb-3" style={{ color: '#9CA3AF' }} />
                  <h3 className="text-xl font-semibold break-words" style={{ color: '#111827' }}>{project.clientName || 'N/A'}</h3>
                  {project.description && (
                    <p className="text-sm mt-1 break-words" style={{ color: '#6B7280' }}>{project.description}</p>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}
                    className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    style={{ color: '#F4A100', backgroundColor: '#FFFFFF', hover: { color: '#E09000' } }}
                    title="Edit Project"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(project._id); }}
                    className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{ color: '#595959ff', backgroundColor: '#FFFFFF', hover: { color: '#6b6b6bff' } }}
                    title="Delete Project"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </>
            )}

            {deleteConfirmation === project._id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center p-5 rounded-lg shadow-inner z-10">
                <p className="mb-3 text-center font-medium" style={{ color: '#1F2937' }}>Type "<strong>{project.clientName}</strong>" to confirm deletion:</p>
                <input
                  type="text"
                  className="border p-2 rounded-sm w-full max-w-xs mb-3 focus:outline-none focus:ring-1 focus:ring-red-500"
                  style={{ color: '#1F2937' }}
                  value={verifyClientName}
                  onChange={(e) => setVerifyClientName(e.target.value)}
                  placeholder="Enter client name"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full justify-center">
                  <button
                    onClick={() => confirmDeleteProject(project._id, project.clientName)}
                    className="px-4 py-2 rounded-md transition duration-200 shadow-sm text-sm sm:text-base"
                    style={{ backgroundColor: '#DC2626', color: '#FFFFFF', hover: { backgroundColor: '#B91C1C' } }}
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirmation('');
                      setVerifyClientName('');
                    }}
                    className="px-4 py-2 rounded-md transition duration-200 shadow-sm text-sm sm:text-base"
                    style={{ backgroundColor: '#E5E7EB', color: '#1F2937', hover: { backgroundColor: '#D1D5DB' } }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Create Project */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200/70 flex justify-center items-center z-50 p-4">
          <div className="p-6 sm:p-8 rounded-sm w-full max-w-md shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
            <h3 className="text-xl sm:text-2xl font-bold mb-5" style={{ color: '#1F2937' }}>Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                style={{ color: '#1F2937' }}
              />
              <textarea
                name="description"
                placeholder="Description (e.g., Video Editor)"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 min-h-[6rem]"
                style={{ color: '#1F2937' }}
              />
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md shadow-md transition duration-200"
                  style={{ backgroundColor: '#E5E7EB', color: '#1F2937', hover: { backgroundColor: '#D1D5DB' } }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md shadow-md transition duration-200"
                  style={{ backgroundColor: '#F4A100', color: '#FFFFFF', hover: { backgroundColor: '#E09000' } }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   // </LenisScrollWrapper>
  );
};

export default Projects;
