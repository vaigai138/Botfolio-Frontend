import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube } from 'react-icons/fa'; // Only import icons actually used

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 mt-4 sm:px-8" style={{ backgroundColor: '#1F2937', color: '#E5E7EB' }}>
      <div className="max-w-7xl mx-auto container"> {/* Added container class for max-width and auto margins */}
        <div className="lg:flex">
          {/* Column 1: Botfolio Branding & Description */}
          <div className="w-full lg:w-2/5 px-0 lg:px-6"> {/* Adjusted padding for consistency */}
            <div className="px-0"> {/* Inner padding removed as parent handles it */}
              <Link to="/" className="text-3xl font-bold pacifico-regular" style={{ color: '#F4A100' }}>
                Botfolio
              </Link>

              <p className="max-w-sm mt-3 text-sm" style={{ color: '#9CA3AF' }}>
                Your go-to web app designed specially for freelance creatives like video editors, designers, and digital creators. Manage everything from client projects to invoices, templates, and public portfolios, all in one place.
              </p>

              <div className="flex mt-5 space-x-4"> {/* Adjusted margin and spacing */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4A100] transition-colors" aria-label="Instagram">
                  <FaInstagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4A100] transition-colors" aria-label="YouTube">
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Columns for Links */}
          <div className="mt-8 lg:mt-0 lg:flex-1"> {/* Adjusted margin for mobile/desktop */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"> {/* Removed lg:grid-cols-4 as we only have 3 categories */}
              {/* Company Links */}
              <div>
                <h3 className="text-base font-semibold mb-3 uppercase" style={{ color: '#FFFFFF' }}>Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/#about">About</Link>
                  </li>
                  <li>
                    <Link to="/#services">Services</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Features Links */}
              <div>
                <h3 className="text-base font-semibold mb-3 uppercase" style={{ color: '#FFFFFF' }}>Features</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/dashboard" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Project & Task Management
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/invoices" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Invoice & Payment Tracking
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/all-users" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Public Portfolio Pages
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Plans & Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-base font-semibold mb-3 uppercase" style={{ color: '#FFFFFF' }}>Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/terms-of-service" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="block text-sm hover:text-[#F4A100] transition-colors" style={{ color: '#9CA3AF' }}>
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr className="h-px my-6 bg-gray-700 border-none" style={{ backgroundColor: '#374151' }} /> {/* Reverted to Tailwind's gray-700 for consistency */}

        <div>
          <p className="text-center text-sm" style={{ color: '#6B7280' }}>&copy; {currentYear} Botfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
