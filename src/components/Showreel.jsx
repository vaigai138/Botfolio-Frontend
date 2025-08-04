import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const featuredShowreelItem = {
  title: 'Empowering Freelancers Seamlessly',
  thumbnail: 'https://dummyimage.com/1000x600/F4A100/ffffff&text=Botfolio+Showcase',
  description:
    'Streamline your freelance journey — from client onboarding to final delivery — all in one beautifully designed workspace.',
  link: '#featured-case-study',
};


const Showreel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0px', '100px']);

  return (
    <section ref={ref} id='showreel' className="bg-white py-20 px-6 sm:px-10 lg:px-20 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        
        

        {/* ✨ Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-bold text-[#F4A100]  leading-tight  mb-4 "
        >
          <span className='pacifico-regular'>Botfolio</span> <span className="text-gray-900 ">{featuredShowreelItem.title}</span>
        </motion.h2>

        {/* 📄 Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
        >
          {featuredShowreelItem.description}
        </motion.p>

        {/* 🟠 CTA Button */}
       <Link to="/pricing">
  <motion.button
    whileHover={{ scale: 1.00 }}
    className="mb-6 px-6 py-3 bg-[#F4A100] text-white font-semibold shadow-md hover:shadow-sm cursor-pointer"
  >
    Find Your Subscription
  </motion.button>
</Link>

        {/* 🎥 Video/Image Preview */}
        <motion.div
          style={{ y }}
          className="relative group max-w-4xl mx-auto  overflow-hidden border border-gray-200   transition duration-300 ease-in-out"
        >
          <div className="relative w-full pt-[56.25%] bg-white">
            <img
              src={featuredShowreelItem.thumbnail}
              alt={featuredShowreelItem.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Showreel;
