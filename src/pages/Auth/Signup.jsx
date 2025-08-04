import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../axiosInstance';
import LenisScrollWrapper from '../../components/LenisScrollWrapper';
import { FaCheck, FaTimesCircle } from 'react-icons/fa';

// A custom message component to replace browser alerts
const MessageComponent = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const icon = type === 'error' ? <FaTimesCircle className="h-6 w-6" /> : <FaCheck className="h-6 w-6" />;
  return (
    <div className={`fixed inset-x-0 bottom-4 mx-auto w-11/12 md:w-1/3 p-4 rounded-lg shadow-lg text-white font-bold flex items-center gap-4 z-[9999] transition-all duration-300 ${bgColor}`}>
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
        <FaTimesCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: null, type: null });

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const showMessage = (text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: null, type: null }), duration);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      showMessage('Username can only contain letters, numbers, and underscores (no spaces)', 'error');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      showMessage('You must agree to the Terms of Service to create an account.', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await signup(formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!termsAccepted) {
      showMessage('You must agree to the Terms of Service to create an account with Google.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/users/auth/google', {
        token: credentialResponse.credential,
      });

      if (res.data.newUser) {
        showMessage('Please complete your profile by choosing a username and setting a password.');
        localStorage.setItem('googleSignupToken', credentialResponse.credential);
        localStorage.setItem('googleUserData', JSON.stringify(res.data.user));
        navigate('/complete-google-signup');
      } else {
        loginUser(res.data.user, res.data.token);
      }
    } catch (err) {
      console.error('Google signup backend error:', err);
      showMessage(err.response?.data?.message || 'Google signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showMessage('Google signup failed. Please try again.', 'error');
  };

  return (
    <>
      <LenisScrollWrapper>
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
                className={`w-full p-3 text-white font-semibold rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
                  ${termsAccepted ? 'bg-[#F4A100] hover:opacity-90' : 'bg-yellow-200'}`}
                disabled={!termsAccepted || loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="my-4 text-center text-gray-500">
              <hr className="my-2" />
              OR
              <hr className="my-2" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="100%"
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
      </LenisScrollWrapper>
      <MessageComponent message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
    </>
  );
};

export default Signup;
