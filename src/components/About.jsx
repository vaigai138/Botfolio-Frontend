// src/components/About.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PiRocketLaunch, PiUsers, PiLightbulb, PiCheckCircle } from "react-icons/pi";

const cardData = [
  {
    icon: <PiRocketLaunch size={36} />,
    title: "Our Vision",
    text: "Empowering creatives with tools that support and elevate their process—not slow them down.",
  },
  {
    icon: <PiUsers size={36} />,
    title: "Who We Are",
    text: "A lean crew of makers, thinkers, and doers with a passion for design and meaningful tech.",
  },
  {
    icon: <PiLightbulb size={36} />,
    title: "Our Approach",
    text: "Design-first. User-focused. Tech-driven. Fast iterations, faster learning.",
  },
  {
    icon: <PiCheckCircle size={36} />,
    title: "Why Botfolio",
    text: "Because client management shouldn't feel like work. We make it seamless, elegant, and fast.",
  },
];

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Create a parallax effect on Y axis
  const yParallax = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative bg-white py-24 overflow-hidden">
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
            We’re crafting the ultimate digital workspace for creatives—unifying onboarding, collaboration, and delivery into a seamless flow.
          </p>
          <a
            href="#showreel"
            className="inline-block px-6 py-3 text-white bg-[#F4A100] hover:opacity-90 transition duration-300"
          >
            See Our Story
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
