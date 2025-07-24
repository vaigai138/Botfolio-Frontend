import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const faqData = [
  {
    id: 1,
    question: "What is Botfolio, and who is it for?",
    answer: "Botfolio is an all-in-one platform designed for creative professionals like web developers, graphic designers, videographers, and agencies. It helps manage clients, projects, payments, and showcases your work efficiently.",
  },
  {
    id: 2,
    question: "How does Botfolio help with client management?",
    answer: "Botfolio offers intuitive dashboards for client onboarding, streamlined communication tools, and robust project tracking features to keep you organized and your clients informed every step of the way.",
  },
  {
    id: 3,
    question: "Can I manage payments and invoices through Botfolio?",
    answer: "Absolutely! Botfolio includes integrated tools for automating invoices, tracking payment statuses, and generating financial reports, simplifying your billing process.",
  },
  {
    id: 4,
    question: "Is there a way to showcase my portfolio on Botfolio?",
    answer: "Yes, Botfolio allows you to craft stunning online portfolios with integrated media management, making it easy to display your video, web, and design projects professionally.",
  },
  {
    id: 5,
    question: "What kind of support does Botfolio offer?",
    answer: "We offer comprehensive support including detailed documentation, video tutorials, and a dedicated customer service team ready to assist you with any questions or issues you might encounter.",
  },
  {
    id: 6,
    question: "Is Botfolio suitable for small freelancers or larger agencies?",
    answer: "Botfolio is scalable and designed to meet the needs of both individual freelancers and growing agencies. Its modular features can be adapted to various business sizes and workflows.",
  },
];

// Variants for the accordion content
const contentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: "easeInOut" },
      opacity: { duration: 0.2, ease: "easeInOut", delay: 0.1 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.1, ease: "easeInOut" },
    },
  },
};


const FaqItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg md:text-xl text-black hover:text-[#F4A100] transition-colors duration-200"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.svg // Use motion.svg for smooth rotation
          className={`w-6 h-6 transform text-gray-500`}
          animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? '#F4A100' : '#6B7280' }} // Animate rotation and color
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </motion.svg>
      </button>

      {/* Use motion.div for the collapsible content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        // layout // Enables smooth transition of layout changes (important for height auto)
        className="overflow-hidden"
      >
        <p className="pt-2 text-base md:text-lg text-gray-600 pr-8 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const FAQ = () => {
  const [openFaqId, setOpenFaqId] = useState(null);
  const sectionRef = useRef(null); // Ref for the section to track scroll

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Parallax effect for the heading
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] // When target starts entering, until it fully leaves
  });

  // Transform scroll progress to a Y translation value
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Moves -100px when entering, +100px when leaving

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24" id="faq-section">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-black mb-12 md:mb-16"
          style={{ y }} // Apply the parallax Y transform
        >
          Frequently Asked <span className="text-[#F4A100]">Questions</span>
        </motion.h2>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqId === faq.id}
              toggleOpen={() => toggleFaq(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;