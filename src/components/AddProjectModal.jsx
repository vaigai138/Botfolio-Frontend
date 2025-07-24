import React, { useState } from 'react';
import { createProject } from '../services/project';

const AddProjectModal = ({ onCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    deadline: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(form);
      onCreated(); // 👈 Refresh project list
      setForm({ title: '', description: '', status: 'Not Started', deadline: '' });
      setIsOpen(false); // Close form
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#F4A100] text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        {isOpen ? 'Cancel' : '+ Add New Project'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 rounded-xl border shadow space-y-4">
          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-[#F4A100] text-white py-2 rounded hover:opacity-90 transition"
          >
            Create Project
          </button>
        </form>
      )}
    </div>
  );
};

export default AddProjectModal;
