// src/pages/Welcome.jsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Showreel from '../components/Showreel';
import About from '../components/About';
import LenisScrollWrapper from '../components/LenisScrollWrapper'; // Import the LenisScrollWrapper
import ServicesSection from '../components/ServicesSection';
import FAQ from '../components/FAQ';
import HowItWorks from '../components/HowItWorks';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    // Wrap the entire content that needs smooth scrolling with LenisScrollWrapper
    <LenisScrollWrapper>
      <div className="bg-white">
        {/* 🌟 Hero Section */}
        <div className="relative mt-10 flex items-center justify-center p-8 overflow-hidden">
          {/* 🎨 Background Elements */}
          <img
            src="https://unpkg.com/heroicons@2.0.16/24/solid/star.svg"
            alt="star"
            className="absolute top-[20px] left-[20px] w-[60px] opacity-5 rotate-[12deg] pointer-events-none select-none filter grayscale"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/545/545682.png"
            alt="paper-plane"
            className="absolute top-[30px] right-[60px] w-[70px] opacity-5 rotate-[10deg] pointer-events-none select-none filter grayscale"
          />

          {/* ✏️ Main Content */}
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-20 relative z-10">
            {/* Left */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                Empowering Freelance Creatives<br />
                <span className="text-[#F4A100]">to Work Smarter</span>
              </h1>
              <p className="text-gray-700 mb-8 text-lg">
                Botfolio helps you organize your projects, manage tasks, and track payments —
                all from a single, simple dashboard built for freelancers.
              </p>

              {!user && (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-[#F4A100] text-white px-6 py-3 cursor-pointer font-semibold hover:opacity-90 transition "
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="border border-gray cursor-pointer text-black px-6 py-3 font-semibold hover:bg-[#F4A100]/10 transition "
                  >
                    Login
                  </button>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex-1">
              <img
                src="https://illustrations.popsy.co/gray/work-from-home.svg"
                alt="Botfolio Illustration"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>

        {/* ⬇️ Showreel section stacked vertically below */}
        <Showreel/>
        <About />
        <ServicesSection/>
        <HowItWorks/>
       <FAQ/>
      </div>
    </LenisScrollWrapper>
  );
};

export default Welcome;