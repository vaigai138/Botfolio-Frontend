import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance'; // Assuming axiosInstance is configured for your API base URL
import {
  FaProjectDiagram,
  FaTasks,
  FaMoneyBillWave,
  FaClock,
  FaUserCircle,
  FaCreditCard,
  FaVideo, // For short/long videos
  FaImage, // For graphic images
  FaTag, // For tags
  FaInstagram, // For Instagram link
  FaYoutube, // For YouTube link
  FaBriefcase, // For portfolio type
  FaLink, // For links allowed
  FaPaintBrush // For design limit
} from 'react-icons/fa';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [taskSummary, setTaskSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch User Profile
        const userRes = await axios.get('/api/users/me', { headers });
        setUserProfile(userRes.data);

        // Fetch Project Count
        const projectsRes = await axios.get('/api/projects', { headers });
        if (Array.isArray(projectsRes.data)) {
          setProjectCount(projectsRes.data.length);
        }

        // Fetch Task Summary from the new backend endpoint
        const taskSummaryRes = await axios.get('/api/tasks/summary', { headers });
        setTaskSummary(taskSummaryRes.data);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        // If user data fails, clear it to prevent displaying stale info
        setUserProfile(null);
        setProjectCount(0);
        setTaskSummary({
          totalTasks: 0,
          completedTasks: 0,
          totalRevenue: 0,
          pendingPayments: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate remaining days in free plan
  const getRemainingFreePlanDays = () => {
    if (!userProfile || userProfile.plan?.name !== 'FREE' || !userProfile.plan?.purchasedAt) {
      return 'N/A';
    }

    const purchasedDate = new Date(userProfile.plan.purchasedAt);
    const now = new Date();
    const diffTime = now.getTime() - purchasedDate.getTime(); // Difference in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Days since purchase

    // Assuming a 30-day free plan
    const totalFreeDays = 30;
    const remainingDays = totalFreeDays - diffDays;

    if (remainingDays <= 0) {
      return 'Expired';
    }
    return `${remainingDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffffff' }}>
        <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  const totalPortfolioItems = (userProfile?.shortVideos?.length || 0) +
                             (userProfile?.longVideos?.length || 0) +
                             (userProfile?.graphicImages?.length || 0);

  return (
    <div className="p-6" style={{ backgroundColor: '#ffffffff', minHeight: '100vh' }}>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center mb-4 sm:mb-0">
          {userProfile?.profileImage ? (
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mr-6 shadow-lg border-2"
              style={{ borderColor: '#F4A100' }}
            />
          ) : (
            <FaUserCircle className="text-7xl mr-6" style={{ color: '#9CA3AF' }} />
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }}>
              Welcome back, <span style={{ color: '#F4A100' }}>{userProfile?.name || 'Freelancer'} 👋</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Here's a quick overview of your work today. Let’s make it productive!
            </p>
            <div className="flex items-center mt-3 space-x-4">
              {userProfile?.instagram && (
                <a href={`https://instagram.com/${userProfile.instagram}`} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#6B7280', hover: { color: '#F4A100' } }}>
                  <FaInstagram size={24} />
                </a>
              )}
              {userProfile?.youtube && (
                <a href={userProfile.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#6B7280', hover: { color: '#F4A100' } }}>
                  <FaYoutube size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>Current Plan:</p>
          <p className="text-xl font-bold" style={{ color: '#F4A100' }}>{userProfile?.plan?.name || 'N/A'}</p>
          {userProfile?.plan?.name === 'FREE' && (
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Remaining: {getRemainingFreePlanDays()}
            </p>
          )}
          {(userProfile?.plan?.linksAllowed || userProfile?.plan?.designLimit) && (
            <div className="mt-2 text-sm" style={{ color: '#374151' }}>
              {userProfile.plan.linksAllowed && (
                <p className="flex items-center justify-end"><FaLink className="mr-1" style={{ color: '#6B7280' }} /> Links Allowed: {userProfile.plan.linksAllowed}</p>
              )}
              {userProfile.plan.designLimit && (
                <p className="flex items-center justify-end"><FaPaintBrush className="mr-1" style={{ color: '#6B7280' }} /> Designs Allowed: {userProfile.plan.designLimit}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skills/Tags Section - Moved Here */}
      {/* {userProfile?.tags && userProfile.tags.length > 0 && (
        <div className="bg-white p-6 rounded-sm shadow-sm border mt-6 mb-8" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2937' }}>Your Skills & Tags</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}
              >
                <FaTag className="inline-block mr-2" />{tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate(`/${username}`)}
            className="mt-6 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}
          >
            Edit Skills
          </button>
        </div>
      )} */}

      {/* Main Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {/* Total Projects */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}>
          <div>
            <FaProjectDiagram className="text-3xl mb-3" />
            <h2 className="text-xl font-semibold">Total Projects</h2>
            <p className="text-3xl mt-2 font-bold">{projectCount}</p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#E09000', color: '#FFFFFF' }}
          >
            View Projects
          </button>
        </div>

        {/* Total Tasks Done */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}>
          <div>
            <FaTasks className="text-3xl mb-3" />
            <h2 className="text-xl font-semibold">Total Tasks Done</h2>
            <p className="text-3xl mt-2 font-bold">{taskSummary.totalTasks}</p>
          </div>
          {/* Assuming tasks are viewed within projects */}
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#374151', color: '#FFFFFF' }}
          >
            View Tasks
          </button>
        </div>

        {/* Total Revenue Generated */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937' }}>
          <div>
            <FaMoneyBillWave className="text-3xl mb-3" style={{ color: '#F4A100' }} />
            <h2 className="text-xl font-semibold">Total Revenue</h2>
            <p className="text-3xl mt-2 font-bold">₹{taskSummary.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          {/* Assuming invoices/payments are linked to projects */}
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}
          >
            View Payments
          </button>
        </div>

        {/* Pending Payments - Color changed from red to dark gray */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937' }}>
          <div>
            <FaCreditCard className="text-3xl mb-3" style={{ color: '#1F2937' }} />
            <h2 className="text-xl font-semibold">Pending Payments</h2>
            <p className="text-3xl mt-2 font-bold">₹{taskSummary.pendingPayments.toLocaleString('en-IN')}</p>
          </div>
          {/* Assuming pending payments are linked to projects */}
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}
          >
            Resolve Payments
          </button>
        </div>

        {/* Total Portfolio Items */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}>
          <div>
            <FaBriefcase className="text-3xl mb-3" />
            <h2 className="text-xl font-semibold">Total Portfolio Items</h2>
            <p className="text-3xl mt-2 font-bold">{totalPortfolioItems}</p>
          </div>
          {/* Assuming profile page shows portfolio */}
          <button
            onClick={() => navigate(`/${userProfile?.username}`)}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#E09000', color: '#FFFFFF' }}
          >
            View Portfolio
          </button>
        </div>

        {/* Portfolio Type */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}>
          <div>
            <FaBriefcase className="text-3xl mb-3" />
            <h2 className="text-xl font-semibold">Portfolio Type</h2>
            <p className="text-2xl mt-2 font-bold capitalize">{userProfile?.portfolioType || 'Not Set'}</p>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#374151', color: '#FFFFFF' }}
          >
            Edit Profile
          </button>
        </div>

        {/* Short Videos Count */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937' }}>
          <div>
            <FaVideo className="text-3xl mb-3" style={{ color: '#F4A100' }} />
            <h2 className="text-xl font-semibold">Short Videos</h2>
            <p className="text-3xl mt-2 font-bold">{userProfile?.shortVideos?.length || 0}</p>
          </div>
          <button
            onClick={() => navigate(`/${userProfile?.username}`)}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}
          >
            Manage Videos
          </button>
        </div>

        {/* Graphic Images Count */}
        <div className="p-6 rounded-sm shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1F2937' }}>
          <div>
            <FaImage className="text-3xl mb-3" style={{ color: '#1F2937' }} />
            <h2 className="text-xl font-semibold">Graphic Images</h2>
            <p className="text-3xl mt-2 font-bold">{userProfile?.graphicImages?.length || 0}</p>
          </div>
          <button
            onClick={() => navigate(`/${username}`)}
            className="mt-4 px-4 py-2 text-sm rounded-sm cursor-pointer"
            style={{ backgroundColor: '#1F2937', color: '#FFFFFF' }}
          >
            Manage Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
