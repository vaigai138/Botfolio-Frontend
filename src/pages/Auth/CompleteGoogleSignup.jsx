import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';

const CompleteGoogleSignup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    const googleSignupToken = localStorage.getItem('googleSignupToken');
    const googleUserData = localStorage.getItem('googleUserData');

    if (!googleSignupToken || !googleUserData) {
      alert('Missing Google signup information. Please try logging in with Google again.');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(googleUserData);
      if (userData.name) {
        setName(userData.name);
      }
    } catch (e) {
      console.error("Failed to parse Google user data from localStorage", e);
    }
    setLoading(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores (no spaces).');
      return;
    }

    if (!termsAccepted) { // Check terms acceptance
      setError('You must agree to the Terms of Service to complete your signup.');
      return;
    }

    const googleSignupToken = localStorage.getItem('googleSignupToken');
    const googleUserData = JSON.parse(localStorage.getItem('googleUserData'));

    if (!googleSignupToken || !googleUserData) {
      setError('Google signup information is missing. Please try again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/users/auth/google/complete-signup', {
        googleIdToken: googleSignupToken,
        username,
        name: name || googleUserData.name,
        email: googleUserData.email,
      });

      loginUser(res.data.user, res.data.token);
      localStorage.removeItem('googleSignupToken');
      localStorage.removeItem('googleUserData');
    } catch (err) {
      console.error('Complete signup error:', err);
      setError(err.response?.data?.message || 'Failed to complete signup. Username might be taken.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 shadow-xl border border-gray-100 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your <span className="text-[#F4A100] pacifico-regular">Botfolio</span> Signup
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Choose a Username"
            className="w-full p-3 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            Your Google email ({JSON.parse(localStorage.getItem('googleUserData'))?.email}) will be used.
          </p>

          {/* Terms of Service Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="termsGoogle"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-[#F4A100] focus:ring-[#F4A100] border-gray-300 rounded"
            />
            <label htmlFor="termsGoogle" className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <span
                onClick={() => navigate('/terms-of-service')}
                className="text-[#F4A100] cursor-pointer underline"
              >
                Terms of Service
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full p-3 text-white font-semibold rounded transition ${
              termsAccepted ? 'bg-[#F4A100] hover:opacity-90' : 'bg-yellow-200 cursor-not-allowed'
            }`}
            disabled={!termsAccepted} // Disable button if terms not accepted
          >
            Complete Signup
          </button>
        </form>
      </div>
    </div>
  );
};  

export default CompleteGoogleSignup;