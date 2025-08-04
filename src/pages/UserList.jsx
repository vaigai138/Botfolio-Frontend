import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance'; // Assuming axiosInstance is configured for your API base URL
import { FaUserCircle, FaBriefcase } from 'react-icons/fa'; // Icons for profile and portfolio type
//import LenisScrollWrapper from '../components/LenisScrollWrapper';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- NEW API CALL FOR USERLIST ---
        const res = await axios.get('/api/all-users'); // <-- THIS IS THE NEW API ENDPOINT
        // ---------------------------------
        
        // Sort users by creation date (optional, but good for consistency)
        const sortedUsers = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setUsers(sortedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user profiles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffffff' }}>
        <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>Loading user profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffffff' }}>
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (

    //<LenisScrollWrapper>

    <div className="p-6" style={{ backgroundColor: '#ffffffff', minHeight: '100vh' }}>

      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#1F2937' }}>
        Explore Freelancer Profiles
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((userProfile) => (
            <div
              key={userProfile._id}
              className="bg-white rounded-sm shadow-sm p-6 flex flex-col items-center text-center border border-gray-200"
            >
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt={userProfile.name || 'User'}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2"
                  style={{ borderColor: '#F4A100' }}
                />
              ) : (
                <FaUserCircle className="text-7xl mb-4" style={{ color: '#9CA3AF' }} />
              )}
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#1F2937' }}>
                {userProfile.name || 'Freelancer'}
              </h2>
              <p className="text-sm mb-4 flex items-center" style={{ color: '#6B7280' }}>
                <FaBriefcase className="mr-2" style={{ color: '#9CA3AF' }} />
                {userProfile.portfolioType ? userProfile.portfolioType.charAt(0).toUpperCase() + userProfile.portfolioType.slice(1) : 'Not Specified'}
              </p>
              <button
                // Assuming you want to navigate to the public profile based on username
                onClick={() => navigate(`/${userProfile.username}`)} 
                className="mt-4 px-6 py-2 text-sm font-semibold rounded-sm transition duration-300 ease-in-out transform hover:scale-105"
                style={{ backgroundColor: '#F4A100', color: '#FFFFFF' }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    //</LenisScrollWrapper>
  );
};

export default UserList;
