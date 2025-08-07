import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }

            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target) &&
                !e.target.closest('.mobile-menu-toggle')
            ) {
                setMobileMenuOpen(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleNavLinkClick = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    const navigateToHomeSection = (sectionId) => {
        handleNavLinkClick();
        if (location.pathname === '/') {
            const target = document.querySelector(sectionId);
            if (target && window.lenis) {
                window.lenis.scrollTo(target);
            } else if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const target = document.querySelector(sectionId);
                if (target && window.lenis) {
                    window.lenis.scrollTo(target);
                } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <nav className={`px-4 sm:px-8 py-3 flex items-center justify-between relative bg-white z-50 sticky top-0 transition-shadow duration-300 ${
            isScrolled ? 'shadow-md' : ''
        }`}>
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F4A100] mobile-menu-toggle"
                >
                    {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <div className="hidden md:flex gap-6 items-center">
                <a
                    href="#about"
                    onClick={(e) => {
                        e.preventDefault();
                        navigateToHomeSection('#about');
                    }}
                    className="text-gray-700 hover:text-[#F4A100] font-medium"
                >
                    About Us
                </a>
                {user && (
                    <>
                        <Link to="/dashboard" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
                            Dashboard
                        </Link>
                        <Link to="/projects" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
                            Projects
                        </Link>
                        <Link to="/pricing" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
                            Pricing
                        </Link>
                        <Link to="/all-users" className="text-gray-700 hover:text-[#F4A100] font-medium" onClick={handleNavLinkClick}>
                            Find Freelancers
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin/dashboard" className="text-red-600 font-bold hover:text-red-800" onClick={handleNavLinkClick}>
                                Admin
                            </Link>
                        )}
                    </>
                )}
            </div>

            <div
                className="text-2xl font-bold text-[#F4A100] pacifico-regular cursor-pointer absolute left-1/2 transform -translate-x-1/2"
                onClick={() => { navigate('/'); handleNavLinkClick(); }}
            >
                Botfolio
            </div>

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
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => { handleNavLinkClick(); navigate(`/${user.username}`); }}
                                >
                                    View Profile
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => { handleNavLinkClick(); navigate('/edit-profile'); }}
                                >
                                    Edit Profile
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
                    <div className="hidden md:flex items-center gap-4">
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

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-90 z-40 flex flex-col space-y-4 py-4 px-6 shadow-lg" ref={mobileMenuRef}>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A100]"
                    >
                        <FaTimes size={30} />
                    </button>

                    <button
                        onClick={() => navigateToHomeSection('#about')}
                        className="text-white text-xl font-medium hover:text-[#F4A100] text-left"
                    >
                        About Us
                    </button>
                    
                    {user && (
                        <>
                            <Link to="/dashboard" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                                Dashboard
                            </Link>
                            <Link to="/projects" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                                Projects
                            </Link>
                            <Link to="/pricing" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                                Pricing
                            </Link>
                            <Link to="/all-users" className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                                Find Freelancers
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="text-red-500 text-xl font-bold hover:text-yellow-300" onClick={handleNavLinkClick}>
                                    Admin
                                </Link>
                            )}

                            <Link to={`/${user.username}`} className="text-white text-xl font-medium hover:text-[#F4A100]" onClick={handleNavLinkClick}>
                                View Profile
                            </Link>

                            <button
                                className="text-white text-xl font-medium hover:text-[#F4A100] text-left"
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
