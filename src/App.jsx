import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Make sure this is imported
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Testing from './pages/Testing';
import PublicProfile from './pages/PublicProfile';
import UpdateProfile from './pages/UpdateProfile';
import PricingPage from './pages/PricingPage';
import Footer from './components/Footer';
import UserList from './pages/UserList';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteGoogleSignup from './pages/Auth/CompleteGoogleSignup';
import Careers from './pages/extrapages/Careers';
import Contact from './pages/extrapages/Contact';
import TermsOfService from './pages/extrapages/TermsOfService';
import PrivacyPolicy from './pages/extrapages/PrivacyPolicy';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ScrollToTop from './ScrollToTop';

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // FIX: Updated console.error message to reflect VITE_ prefix
  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined. Google login may not work.");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Navbar />
<ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-google-signup" element={<CompleteGoogleSignup />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* 🔐 Protected Routes for regular users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route path='/test' element={<Testing />}></Route>

        <Route path='/all-users' element={<UserList />} />
        <Route path="/:username" element={<PublicProfile />} />
        <Route path="/edit-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Extra Pages (Publicly Accessible) */}
        <Route path='/careers' element={<Careers />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} /> {/* Corrected path from 'privacy-policy' to '/privacy-policy' */}

        {/* 👮‍♂️ Protected Admin Route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </GoogleOAuthProvider>
  );
}

export default App;
