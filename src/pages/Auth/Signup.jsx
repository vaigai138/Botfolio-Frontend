import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../axiosInstance';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      alert('Username can only contain letters, numbers, and underscores (no spaces)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!termsAccepted) { // Check terms acceptance
      alert('You must agree to the Terms of Service to create an account.');
      return;
    }

    try {
      const res = await signup(formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // Crucial check: Before proceeding with Google signup, check if terms are accepted
    if (!termsAccepted) {
      alert('You must agree to the Terms of Service to create an account with Google.');
      return; // Stop the process if terms are not accepted
    }

    try {
      console.log('Google signup success:', credentialResponse);
      const res = await axiosInstance.post('/api/users/auth/google', {
        token: credentialResponse.credential,
      });

      if (res.data.newUser) {
        // This user is new via Google. They need to set a username and a password.
        alert('Please complete your profile by choosing a username and setting a password.');
        localStorage.setItem('googleSignupToken', credentialResponse.credential);
        localStorage.setItem('googleUserData', JSON.stringify(res.data.user));
        // The /complete-google-signup route should now handle collecting username and requiring password
        navigate('/complete-google-signup');
      } else {
        // Existing user, log them in directly.
        loginUser(res.data.user, res.data.token);
      }
    } catch (err) {
      console.error('Google signup backend error:', err);
      alert(err.response?.data?.message || 'Google signup failed');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Signup Failed');
    alert('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 shadow-xl border border-gray-100 rounded-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign Up for <span className="text-[#F4A100] pacifico-regular">Botfolio</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded pr-10"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded pr-10"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-[#F4A100] focus:ring-[#F4A100] border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
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
            Sign Up
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">
          <hr className="my-2" />
          OR
          <hr className="my-2" />
        </div>

        {/* Google Signup Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            // The Google button itself cannot be directly disabled based on `termsAccepted`
            // But we add the check in handleGoogleSuccess, which is the key.
          />
        </div>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <span
            className="text-[#F4A100] cursor-pointer underline"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;