import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; // Assuming you have lucide-react for icons

const CompleteGoogleSignup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      // Optionally, pre-fill username if available or suggest from email
      if (userData.username) {
        setUsername(userData.username);
      } else if (userData.email) {
        setUsername(userData.email.split('@')[0]); // Suggest username from email
      }
    } catch (e) {
      console.error("Failed to parse Google user data from localStorage", e);
      // Consider clearing storage and redirecting if data is corrupt
      localStorage.removeItem('googleSignupToken');
      localStorage.removeItem('googleUserData');
      navigate('/login');
      return;
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

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 6) { // Example: minimum password length
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
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
      // Send googleIdToken, username, name, email, and the NEW password to backend
      const res = await axiosInstance.post('/api/users/auth/google/complete-signup', {
        googleIdToken: googleSignupToken,
        username,
        name: name || googleUserData.name, // Use current name state, fallback to Google's
        email: googleUserData.email,
        password, // Include the chosen password
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
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
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F4A100]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Choose a Username"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F4A100]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            Your Google email ({JSON.parse(localStorage.getItem('googleUserData'))?.email}) will be used.
          </p>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Set Your Password"
              className="w-full p-3 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-1 focus:ring-[#F4A100]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Your Password"
              className="w-full p-3 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-1 focus:ring-[#F4A100]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

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
              termsAccepted && username && password && confirmPassword && password === confirmPassword
                ? 'bg-[#F4A100] hover:opacity-90'
                : 'bg-yellow-200 cursor-not-allowed'
            }`}
            disabled={!(termsAccepted && username && password && confirmPassword && password === confirmPassword)}
          >
            Complete Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteGoogleSignup;