import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../axiosInstance';
//import LenisScrollWrapper from '../../components/LenisScrollWrapper';
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


const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: null, type: null });

  const showMessage = (text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: null, type: null }), duration);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/users/auth/google', {
        token: credentialResponse.credential,
      });

      if (res.data.newUser) {
        showMessage('Please complete your profile by choosing a username.');
        localStorage.setItem('googleSignupToken', credentialResponse.credential);
        localStorage.setItem('googleUserData', JSON.stringify(res.data.user));
        navigate('/complete-google-signup');
      } else {
        loginUser(res.data.user, res.data.token);
      }
    } catch (err) {
      console.error('Google login backend error:', err);
      showMessage(err.response?.data?.message || 'Google login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showMessage('Google login failed. Please try again.', 'error');
  };

  return (
    <>
     // <LenisScrollWrapper>
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
                className="w-full p-3 bg-[#F4A100] text-white font-semibold rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
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
    //  </LenisScrollWrapper>
      <MessageComponent message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
    </>
  );
};

export default Login;
