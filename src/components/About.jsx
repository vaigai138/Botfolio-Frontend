// src/components/About.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PiRocketLaunch, PiUsers, PiLightbulb, PiCheckCircle } from "react-icons/pi";

const cardData = [
  {
    icon: <PiRocketLaunch size={36} />,
    title: "Our Vision",
    text: "To revolutionize how freelancers and creative professionals manage their work—from pitch to payment—all in one beautiful space.",
  },
  {
    icon: <PiUsers size={36} />,
    title: "Who We Are",
    text: "A passionate team of developers, designers, and creatives building tools for fellow freelancers to thrive in the digital world.",
  },
  {
    icon: <PiLightbulb size={36} />,
    title: "Our Approach",
    text: "Intuitive design meets powerful functionality. Every feature in Botfolio is crafted with real creators in mind.",
  },
  {
    icon: <PiCheckCircle size={36} />,
    title: "Why Botfolio",
    text: "Because managing clients, projects, and invoices shouldn't be a headache. Botfolio simplifies it all with a clean and user-first experience.",
  },
];


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


const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Create a parallax effect on Y axis
  const yParallax = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} id="about" className="relative bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:flex lg:items-start lg:gap-20">
        {/* Left Content */}
        <motion.article
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 mb-16 lg:mb-0 z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
            Welcome to <span className="text-[#F4A100] pacifico-regular">Botfolio</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Botfolio is your creative command center — manage projects, showcase portfolios, track invoices, and collaborate effortlessly. All in one place, built just for you.
          </p>
          <a
            href="#showreel"
             onClick={(e) => {
                        e.preventDefault();
                        navigateToHomeSection('#showreel');
                    }}
            className="inline-block px-6 py-3 text-white bg-[#F4A100] hover:opacity-90 transition duration-300"
          >
            Quick Tutorial
          </a>
        </motion.article>

        {/* Right Side Parallax Cards */}
        <motion.div
          style={{ y: yParallax }}
          className="lg:w-1/2 grid sm:grid-cols-1 md:grid-cols-2 gap-6"
        >
          {cardData.map((card, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.25,
                type: "spring",
                stiffness: 60,
                damping: 15,
              }}
              viewport={{ once: true }}
              className="p-6 bg-gray-100 border border-gray-200  shadow-md backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
            >
              <div className="text-[#F4A100] mb-3">{card.icon}</div>
              <h3 className="text-xl font-semibold text-black mb-2">{card.title}</h3>
              <p className="text-gray-700 text-base">{card.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Parallax Illustration */}
      <motion.img
        src="https://illustrations.popsy.co/gray/keynote-presentation.svg"
        alt="Team working illustration"
        className="absolute bottom-0 right-0 w-60 md:w-80 opacity-20 pointer-events-none z-0"
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </section>
  );
};

export default About;
