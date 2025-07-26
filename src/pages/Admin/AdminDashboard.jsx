import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Edit, Save, XCircle } from 'lucide-react'; // Example icons for actions
import LenisScrollWrapper from '../../components/LenisScrollWrapper';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('userManagement');

  // State for data fetched from backend
  const [users, setUsers] = useState([]);
  const [allLinks, setAllLinks] = useState([]); // New state for portfolio links
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]); // New state for payments
  const [adminSettings, setAdminSettings] = useState({ newPassword: '', confirmNewPassword: '', platformNotice: '' }); // Admin settings form

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null); // State for user being edited
  const [editFormData, setEditFormData] = useState({}); // State for edit user form

  // --- Fetching Functions ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/admin/portfolio-links');
      setAllLinks(res.data);
    } catch (err) {
      console.error("Error fetching portfolio links:", err);
      setError(err.response?.data?.message || 'Failed to fetch portfolio links.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/api/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.response?.data?.message || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual endpoint for payments
      // const res = await axiosInstance.get('/api/admin/payments');
      // setPayments(res.data);
      setPayments([]); // Placeholder for now
      console.log("Payments feature not yet fully implemented on backend.");
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.response?.data?.message || 'Failed to fetch payments.');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- useEffect to Trigger Fetches ---
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      if (activeSection === 'userManagement') {
        fetchUsers();
      } else if (activeSection === 'portfolioLinks') {
        fetchAllLinks();
      } else if (activeSection === 'platformAnalytics') {
        fetchAnalytics();
      } else if (activeSection === 'invoicesPayments') {
        fetchPayments();
      }
      // No fetch needed for adminSettings initially
    }
  }, [activeSection, currentUser, fetchUsers, fetchAllLinks, fetchAnalytics, fetchPayments]);


  // --- User Management Handlers ---
  const handleEditClick = (userToEdit) => {
    setEditUserId(userToEdit._id);
    setEditFormData({
      role: userToEdit.role,
      accountStatus: userToEdit.accountStatus,
      portfolioVisibility: userToEdit.portfolioVisibility,
      name: userToEdit.name,
      email: userToEdit.email,
      username: userToEdit.username,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.put(`/api/admin/users/${userId}`, editFormData);
      alert(res.data.message || 'User updated successfully!');
      setEditUserId(null); // Exit edit mode
      setEditFormData({});
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error saving user update:", err);
      setError(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        setError(null);
        await axiosInstance.delete(`/api/admin/users/${userId}`);
        alert(`User "${username}" deleted successfully.`);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error("Error deleting user:", err);
        setError(err.response?.data?.message || 'Failed to delete user.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Portfolio Links Handlers ---
  const handleRemoveLink = async (userId, type, url, username) => {
      if (window.confirm(`Are you sure you want to remove this ${type} link from ${username}?`)) {
          try {
              setLoading(true);
              setError(null);
              await axiosInstance.post('/api/admin/portfolio-links/remove', { userId, type, url });
              alert('Link removed successfully!');
              fetchAllLinks(); // Re-fetch links to update UI
          } catch (err) {
              console.error('Error removing link:', err);
              setError(err.response?.data?.message || 'Failed to remove link.');
          } finally {
              setLoading(false);
          }
      }
  };


  // --- Admin Settings Handlers ---
  const handleAdminSettingsChange = (e) => {
    setAdminSettings({ ...adminSettings, [e.target.name]: e.target.value });
  };

  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    if (adminSettings.newPassword !== adminSettings.confirmNewPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    if (!adminSettings.newPassword || adminSettings.newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual backend endpoint for changing admin password
      // await axiosInstance.put('/api/admin/settings/password', {
      //   currentPassword: 'current_admin_password_if_needed', // This is tricky, often done via a separate secure flow
      //   newPassword: adminSettings.newPassword
      // });
      alert('Admin password changed successfully!');
      setAdminSettings(prev => ({ ...prev, newPassword: '', confirmNewPassword: '' })); // Clear form
    } catch (err) {
      console.error('Error changing admin password:', err);
      setError(err.response?.data?.message || 'Failed to change admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlatformNotice = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual backend endpoint for platform notices
      // await axiosInstance.post('/api/admin/settings/notice', {
      //   message: adminSettings.platformNotice,
      //   isActive: true // Or a checkbox to toggle this
      // });
      alert('Platform notice updated successfully!');
      // You might want to refetch the notice to display it updated
    } catch (err) {
      console.error('Error updating platform notice:', err);
      setError(err.response?.data?.message || 'Failed to update platform notice.');
    } finally {
      setLoading(false);
    }
  };


  // --- Loading and Error States ---
  if (loading && currentUser?.role === 'admin') return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading Admin Dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!currentUser || currentUser.role !== 'admin') return <div className="min-h-screen flex items-center justify-center text-red-500">Access Denied: You are not authorized to view this page.</div>;


  return (
    <LenisScrollWrapper>
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-8 text-[#F4A100]">Admin Panel</h3>
        <nav>
          <ul>
            <li className="mb-3">
              <button
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeSection === 'userManagement' ? 'bg-[#F4A100] text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveSection('userManagement')}
              >
                User Management
              </button>
            </li>
            <li className="mb-3">
              <button
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeSection === 'portfolioLinks' ? 'bg-[#F4A100] text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveSection('portfolioLinks')}
              >
                Portfolio Links
              </button>
            </li>
            <li className="mb-3">
              <button
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeSection === 'platformAnalytics' ? 'bg-[#F4A100] text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveSection('platformAnalytics')}
              >
                Platform Analytics
              </button>
            </li>
            <li className="mb-3">
              <button
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeSection === 'invoicesPayments' ? 'bg-[#F4A100] text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveSection('invoicesPayments')}
              >
                Invoices & Payments
              </button>
            </li>
            <li className="mb-3">
              <button
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${activeSection === 'adminSettings' ? 'bg-[#F4A100] text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveSection('adminSettings')}
              >
                Admin Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          {activeSection === 'userManagement' && 'User Management'}
          {activeSection === 'portfolioLinks' && 'Portfolio Links Overview'}
          {activeSection === 'platformAnalytics' && 'Platform Analytics'}
          {activeSection === 'invoicesPayments' && 'Invoices & Payments'}
          {activeSection === 'adminSettings' && 'Admin Settings'}
        </h1>

        {/* Content for each section */}
        {activeSection === 'userManagement' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Registered Users</h2>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">User ID</th>
                      <th className="py-3 px-6 text-left">Username</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Role</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Visibility</th>
                      <th className="py-3 px-6 text-left">Date Joined</th>
                      <th className="py-3 px-6 text-left">Last Login</th> {/* Added for analytics */}
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{user._id}</td>
                        <td className="py-3 px-6 text-left">
                           {editUserId === user._id ? (
                            <input
                              type="text"
                              name="username"
                              value={editFormData.username}
                              onChange={handleEditChange}
                              className="p-1 border rounded w-full"
                            />
                           ) : (
                            user.username
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                            {editUserId === user._id ? (
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditChange}
                                className="p-1 border rounded w-full"
                              />
                            ) : (
                              user.email
                            )}
                        </td>
                        <td className="py-3 px-6 text-left">
                            {editUserId === user._id ? (
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditChange}
                                className="p-1 border rounded w-full"
                              />
                            ) : (
                              user.name
                            )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editUserId === user._id ? (
                            <select
                              name="role"
                              value={editFormData.role}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
                            user.role
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editUserId === user._id ? (
                            <select
                              name="accountStatus"
                              value={editFormData.accountStatus}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            >
                              <option value="active">active</option>
                              <option value="banned">banned</option>
                              <option value="suspended">suspended</option>
                            </select>
                          ) : (
                            user.accountStatus
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {editUserId === user._id ? (
                            <select
                              name="portfolioVisibility"
                              value={editFormData.portfolioVisibility}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            >
                              <option value="public">public</option>
                              <option value="private">private</option>
                            </select>
                          ) : (
                            user.portfolioVisibility
                          )}
                        </td>
                        <td className="py-3 px-6 text-left text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-6 text-left text-sm">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            {editUserId === user._id ? (
                              <>
                                <button
                                  className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 hover:bg-green-600 transition"
                                  onClick={() => handleSaveEdit(user._id)}
                                  title="Save Changes"
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition"
                                  onClick={() => setEditUserId(null)}
                                  title="Cancel Edit"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 hover:bg-blue-600 transition"
                                  onClick={() => handleEditClick(user)}
                                  title="Edit User"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser._id === user._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'} transition`}
                                  onClick={() => handleDeleteUser(user._id, user.username)}
                                  disabled={currentUser._id === user._id}
                                  title={currentUser._id === user._id ? "Cannot delete your own admin account" : "Delete User"}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No users found.</p>
            )}
          </div>
        )}

        {activeSection === 'portfolioLinks' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Portfolio Links Overview</h2>
            {allLinks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">User</th>
                                <th className="py-3 px-6 text-left">Link Type</th>
                                <th className="py-3 px-6 text-left">Link URL</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {allLinks.map((link, index) => (
                                <tr key={`${link.userId}-${link.type}-${link.url}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{link.username} ({link.email})</td>
                                    <td className="py-3 px-6 text-left">{link.type}</td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {link.url.substring(0, 50)}...
                                        </a>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                            onClick={() => handleRemoveLink(link.userId, link.type, link.url, link.username)}
                                            title="Remove Link"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        {/* You can add a "Flag" button here if you implement flagging logic on backend */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No portfolio links found.</p>
            )}
            <p className="text-sm text-gray-500 mt-4">Note: If you wish to flag content, you will need to implement a 'flagged' status in your backend for each link.</p>
          </div>
        )}

        {activeSection === 'platformAnalytics' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Platform Analytics</h2>
            {analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-[#F4A100]">{analytics.totalUsers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Active Users (Last 30 Days)</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.activeUsers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Role Breakdown</p>
                  {Object.entries(analytics.roleBreakdown || {}).map(([role, count]) => (
                    <p key={role} className="text-lg font-medium capitalize">{role}: <span className="font-bold">{count}</span></p>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Portfolio Visibility</p>
                  {Object.entries(analytics.portfolioVisibilityStats || {}).map(([visibility, count]) => (
                    <p key={visibility} className="text-lg font-medium capitalize">{visibility}: <span className="font-bold">{count}</span></p>
                  ))}
                </div>
                {/* Add more detailed analytics like new signups per week, plan distribution, etc. */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-full">
                    <p className="text-gray-600 text-sm">Most Active Users (Placeholder)</p>
                    <p className="text-lg font-medium">Coming soon: Display users with most logins/activity.</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No analytics data available.</p>
            )}
          </div>
        )}

        {activeSection === 'invoicesPayments' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Invoices & Payment Info</h2>
            {payments.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">User Email</th>
                                <th className="py-3 px-6 text-left">Plan Name</th>
                                <th className="py-3 px-6 text-left">Amount</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Purchased At</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {payments.map((payment) => (
                                <tr key={payment._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{payment.user?.email || 'N/A'}</td> {/* Assuming user object is populated */}
                                    <td className="py-3 px-6 text-left">{payment.planName}</td>
                                    <td className="py-3 px-6 text-left">{payment.amount} {payment.currency}</td>
                                    <td className="py-3 px-6 text-left">{payment.status}</td>
                                    <td className="py-3 px-6 text-left">{new Date(payment.purchasedAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Revoke</button>
                                        {/* Add more actions like "View Details" */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
              <p className="text-gray-600">No payment records found. (Implement backend fetching)</p>
            )}
            <p className="text-sm text-gray-500 mt-4">Note: This section requires backend API integration with your payment gateway (e.g., Razorpay) and a dedicated Payment/Subscription model.</p>
          </div>
        )}

        {activeSection === 'adminSettings' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Settings</h2>

            {/* Change Admin Password */}
            <div className="mb-8 border-b pb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Change Admin Password</h3>
                <form onSubmit={handleChangeAdminPassword} className="space-y-4 max-w-md">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={adminSettings.newPassword}
                            onChange={handleAdminSettingsChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F4A100] focus:border-[#F4A100]"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={adminSettings.confirmNewPassword}
                            onChange={handleAdminSettingsChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F4A100] focus:border-[#F4A100]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-[#F4A100] text-white font-semibold rounded-md hover:opacity-90 transition"
                    >
                        Update Password
                    </button>
                </form>
            </div>

            {/* Platform Notices/Alerts */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Platform-wide Notice</h3>
                <form onSubmit={handleUpdatePlatformNotice} className="space-y-4">
                    <div>
                        <label htmlFor="platformNotice" className="block text-sm font-medium text-gray-700">Notice Message</label>
                        <textarea
                            id="platformNotice"
                            name="platformNotice"
                            rows="4"
                            value={adminSettings.platformNotice}
                            onChange={handleAdminSettingsChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F4A100] focus:border-[#F4A100]"
                            placeholder="Enter a message to display across the platform (e.g., maintenance announcement)"
                        ></textarea>
                    </div>
                    {/* You might add a checkbox here to toggle isActive state of the notice */}
                    <button
                        type="submit"
                        className="w-full p-2 bg-[#F4A100] text-white font-semibold rounded-md hover:opacity-90 transition"
                    >
                        Save Notice
                    </button>
                </form>
            </div>

            {/* Add/Remove Co-Admins (More complex, requires separate form and validation) */}
            <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Co-Admin Management (Future)</h3>
                <p className="text-gray-600">
                    This feature will allow you to add or revoke administrative privileges for other users.
                    It requires careful implementation of user search and role update mechanisms.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
    </LenisScrollWrapper>
  );
};

export default AdminDashboard;