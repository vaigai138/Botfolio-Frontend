import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth'; // Assuming this is your regular login service
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import axiosInstance from '../../axiosInstance'; // Import axiosInstance
import LenisScrollWrapper from '../../components/LenisScrollWrapper';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      //console.log('Google login success:', credentialResponse);
      const res = await axiosInstance.post('/api/users/auth/google', {
        token: credentialResponse.credential, // Send the ID token to your backend
      });

      // Based on your backend's response, handle login or redirect for signup completion
      if (res.data.newUser) {
        // New user from Google, redirect to a "complete signup" page
        alert('Please complete your profile by choosing a username.');
        // Store partial user data or ID token if needed for the next step
        localStorage.setItem('googleSignupToken', credentialResponse.credential);
        localStorage.setItem('googleUserData', JSON.stringify(res.data.user)); // Pass user data if available
        navigate('/complete-google-signup');
      } else {
        // Existing user, log them in
        loginUser(res.data.user, res.data.token);
      }
    } catch (err) {
      console.error('Google login backend error:', err);
      alert(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
   // console.log('Google Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <LenisScrollWrapper>
    <div className="min-h-screen p-2 flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 shadow-xl border border-gray-100 rounded-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to <span className="text-[#F4A100] pacifico-regular">Botfolio</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or Username"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full p-3 pr-10 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#F4A100] text-white font-semibold rounded hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">
          <hr className="my-2" />
          OR
          <hr className="my-2" />
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%" // Makes the button wider if needed
          />
        </div>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{' '}
          <span
            className="text-[#F4A100] cursor-pointer underline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
    </LenisScrollWrapper>
  );
};

export default Login;
