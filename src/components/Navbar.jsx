import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'; // Import FaBars and FaTimes

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for mobile menu to handle clicks outside

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close profile dropdown if click outside
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      // Close mobile menu if click outside (only if it's open and not the toggle button itself)
      // We check if the clicked element is NOT the hamburger button itself
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to close both menus when a link is clicked
  const handleNavLinkClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="px-4 sm:px-8 py-3 flex items-center justify-between relative bg-white z-50">
      {/* Mobile Menu Toggle (Hamburger) - Visible on small screens */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F4A100] mobile-menu-toggle" // Added  back
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Desktop: Left menu items - Hidden on small screens */}
      <div className="hidden md:flex gap-6 items-center">
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector('#about');
            if (target && window.lenis) {
              window.lenis.scrollTo(target);
            }
          }}
          className="text-gray-700 hover:text-[#F4A100] font-medium"
        >
          About Us
        </a>
        <a
          href="#services"
          className="text-gray-700 hover:text-[#F4A100] font-medium"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector('#services');
            if (target && window.lenis) {
              window.lenis.scrollTo(target);
            }
          }}
        >
          Services
        </a>
        {user && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
              Projects
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-red-600 font-bold hover:text-red-800" onClick={handleNavLinkClick}>
                Admin
              </Link>
            )}
          </>
        )}
      </div>

      {/* Center: Logo - Always visible */}
      <div
        className="text-2xl font-bold text-[#F4A100] pacifico-regular cursor-pointer absolute left-1/2 transform -translate-x-1/2"
        onClick={() => { navigate('/'); handleNavLinkClick(); }}
      >
        Botfolio
      </div>

      {/* Right: Profile or Auth - Visible on all screens, but dropdown now also on mobile */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-9 h-9 rounded-full bg-[#F4A100] text-white flex items-center justify-center font-bold cursor-pointer shadow-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title={user.name}
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitial(user.name)
              )}
            </div>

            {dropdownOpen && (
              // Removed 'hidden' from here, so it's visible on all screens when open
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => { handleNavLinkClick(); navigate(`/${user.username}`); }}
                >
                  View Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => { handleNavLinkClick(); logoutUser(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4"> {/* Auth buttons still hidden on mobile */}
            <button
              onClick={() => { navigate('/login'); handleNavLinkClick(); }}
              className="bg-[#F4A100] text-white px-6 py-2 border border-[#F4A100] font-semibold cursor-pointer"
            >
              Login
            </button>
            <Link to="/signup" className="text-gray-700 border border-gray-400 px-3 py-2 font-medium " onClick={handleNavLinkClick}>
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay - Now a "small window" dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-90 z-40 flex flex-col space-y-4 py-4 px-6 shadow-lg" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2  text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A100]"
          >
            <FaTimes size={30} />
          </button>

          <Link to="/about" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
            About Us
          </Link>
          <Link to="/services" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
            Services
          </Link>


          {user && (
            <>
              <Link to="/dashboard" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                Dashboard
              </Link>
              <Link to="/projects" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                Projects
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-red-500 text-xl font-bold hover:text-yellow-300" onClick={handleNavLinkClick}>
                  Admin
                </Link>
              )}

              {/* Profile and Logout are handled by the dropdown now, but keeping these for mobile menu consistency if user isn't logged in */}
              <Link to={`/${user.username}`} className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                View Profile
              </Link>

              <button
                className="text-white text-xl font-medium hover:text-[#F4A100] text-left" // Added text-left for consistency
                onClick={() => { handleNavLinkClick(); logoutUser(); }}
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <button
                onClick={() => { navigate('/login'); handleNavLinkClick(); }}
                className="bg-[#F4A100] text-white px-6 py-2 text-lg font-semibold w-full"
              >
                Login
              </button>
              <Link to="/signup" className="text-white border-2 border-white px-6 py-2 text-lg font-medium w-full" onClick={handleNavLinkClick}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;  