import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'Not Started': 'bg-gray-200 text-gray-800',
  'In Progress': 'bg-yellow-200 text-yellow-900',
  'Completed': 'bg-green-200 text-green-800',
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-5 rounded-xl border shadow hover:shadow-lg transition cursor-pointer bg-white"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${statusColors[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {project.description || 'No description'}
      </p>
      <p className="text-xs text-gray-500">
        Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
      </p>
    </div>
  );
};

export default ProjectCard;
