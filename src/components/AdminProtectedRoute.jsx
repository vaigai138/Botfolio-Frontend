import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally show a loading spinner or message
    return <div>Loading authentication...</div>;
  }

  if (!user || user.role !== 'admin') {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;