import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const featuredShowreelItem = {
  title: 'Empowering Freelancers Seamlessly',
  thumbnail: 'https://placehold.jp/1920x1080.png',
  description: 'Don’t guess. Watch and get going in 2 minutes.',
  vimeoId: '1107961955',
};

const Showreel = () => {
  const ref = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0px', '100px']);

  const handleQuickGuideClick = () => {
    setShowVideo(true);

    // Optional: Scroll to video after showing
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Give time for state to update
  };

  return (
    <section ref={ref} id='showreel' className="bg-white py-20 px-6 sm:px-10 lg:px-20 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-bold text-[#F4A100] leading-tight mb-4"
        >
          <span className='pacifico-regular'>Botfolio</span>{' '}
          <span className="text-gray-900">{featuredShowreelItem.title}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
        >
          {featuredShowreelItem.description}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.00 }}
          className="mb-6 px-6 py-3 bg-[#F4A100] text-white font-semibold shadow-md hover:shadow-sm cursor-pointer"
          onClick={handleQuickGuideClick}
        >
          Quick Guide
        </motion.button>

        <motion.div
          style={{ y }}
          className="relative group max-w-4xl mx-auto overflow-hidden border border-gray-200 transition duration-300 ease-in-out"
        >
          {!showVideo ? (
            <div
              className="relative w-full pt-[56.25%] bg-white cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              <img
                src={featuredShowreelItem.thumbnail}
                alt={`${featuredShowreelItem.title} thumbnail`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative w-full pt-[56.25%]">
              <iframe
                title={featuredShowreelItem.title}
                src={`https://player.vimeo.com/video/${featuredShowreelItem.vimeoId}?autoplay=1&muted=0&controls=1&title=0&byline=0&portrait=0`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Showreel;
