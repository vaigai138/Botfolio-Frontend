import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const featuredShowreelItem = {
  title: 'Empowering Freelancers Seamlessly',
  description:
    'Streamline your freelance journey — from client onboarding to final delivery — all in one beautifully designed workspace.',
  link: '#featured-case-study',
  vimeoId: '1107961955',
};

const Showreel = () => {
  const ref = useRef(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0px', '100px']);

  useEffect(() => {
    // Fetch thumbnail from Vimeo's oEmbed endpoint
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${featuredShowreelItem.vimeoId}`);
        const data = await response.json();
        setThumbnailUrl(data.thumbnail_url);
      } catch (error) {
        console.error('Failed to fetch Vimeo thumbnail:', error);
      }
    };
    fetchThumbnail();
  }, []);

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

        <Link to="/pricing">
          <motion.button
            whileHover={{ scale: 1.00 }}
            className="mb-6 px-6 py-3 bg-[#F4A100] text-white font-semibold shadow-md hover:shadow-sm cursor-pointer"
          >
            Find Your Subscription
          </motion.button>
        </Link>

        <motion.div
          style={{ y }}
          className="relative group max-w-4xl mx-auto overflow-hidden border border-gray-200 transition duration-300 ease-in-out"
        >
          {!showVideo ? (
            <div
              className="relative w-full pt-[56.25%] bg-white cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={`${featuredShowreelItem.title} thumbnail`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              )}
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
                src={`https://player.vimeo.com/video/${featuredShowreelItem.vimeoId}?autoplay=1`}
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
