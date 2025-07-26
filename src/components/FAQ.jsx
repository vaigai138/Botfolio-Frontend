import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const faqData = [
  {
    id: 1,
    question: "What exactly is Botfolio?",
    answer: "Botfolio is your all-in-one digital command center built for creatives — from video editors and designers to freelancers and small agencies. Manage projects, track payments, collaborate with clients, and build your portfolio — all in one place.",
  },
  {
    id: 2,
    question: "Who can use Botfolio?",
    answer: "If you're a creative freelancer, video editor, graphic designer, web developer, or run a small creative agency — Botfolio is built with your workflow in mind.",
  },
  {
    id: 3,
    question: "How does Botfolio simplify client and project management?",
    answer: "With smart dashboards, task boards, and client timelines, Botfolio lets you onboard clients, manage feedback, assign tasks, and stay on top of deadlines — all without switching tabs.",
  },
  {
    id: 4,
    question: "Can I handle payments and invoices inside Botfolio?",
    answer: "Yes! You can generate branded invoices, track payments in real-time, and view clear financial summaries. No need for separate tools — it's all integrated.",
  },
  {
    id: 5,
    question: "How can I showcase my work on Botfolio?",
    answer: "Create a beautiful public portfolio with links to your best projects — whether it's YouTube videos, Behance designs, or Google Drive previews. Everything is customizable and client-ready.",
  },
  {
    id: 6,
    question: "Is it good for freelancers just starting out?",
    answer: "Absolutely. Whether you're just getting your first client or managing multiple projects, Botfolio scales with you. Start small, grow fast — we’ve got your back.",
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