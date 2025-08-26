import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Send } from "lucide-react";
import { Helmet } from "react-helmet-async";
//import LenisScrollWrapper from "../../components/LenisScrollWrapper";

const jobOpenings = [
  {
    title: "Frontend Developer",
    type: "Part Time",
    location: "Remote",
    desc: "We're looking for a React developer who can build beautiful and functional UIs.",
  },
  {
    title: "Backend Developer",
    type: "Part Time",
    location: "Remote",
    desc: "Seeking a Node.js + MongoDB expert to join our backend team.",
  },
  {
    title: "UI/UX Designer",
    type: "Part Time",
    location: "Remote",
    desc: "Creative designers who can shape our product with modern minimal UI.",
  },
  {
    title: "Video Editor",
    type: "Part Time",
    location: "Remote",
    desc: "Visual storytellers with a knack for fast-paced content and platform trends.",
  },
  {
    title: "Graphic Designer",
    type: "Part Time",
    location: "Remote",
    desc: "Talented designers who can craft brand-aligned visuals for web & social.",
  },
  {
    title: "Social Media Handler",
    type: "Part Time",
    location: "Remote",
    desc: "Energetic folks who can plan, schedule, and grow our online presence.",
  },
];

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent("Application for an Open Role at Botfolio");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPortfolio: ${formData.portfolio}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:infobotfolio@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
   // <LenisScrollWrapper>
   <>
   <Helmet>
  <title>Botfolio | Careers</title>
  <meta
    name="description"
    content="Join the Botfolio team! Explore career opportunities and help us build tools for the future of freelancing."
  />
</Helmet>
  
    <div className="min-h-screen bg-white text-black px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-4"
        >
          Join{" "}
          <span className="text-[#F4A100] pacifico-regular">Botfolio</span>
        </motion.h1>

        <p className="text-center text-gray-600 mb-10">
          We're a team of builders, designers, and storytellers helping
          freelancers thrive. Be part of something meaningful.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-200 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-black">
                  {job.title}
                </h2>
                <Briefcase className="text-[#F4A100]" />
              </div>
              <p className="text-sm text-gray-700 mb-2">{job.desc}</p>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{job.type}</span>
                <span>{job.location}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email Apply Section */}
        <div className="mt-16 bg-[#fff8ec] p-8 rounded-sm border border-[#f4e3b5] shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-[#F4A100] text-center">
            We're hiring Video Editors & Graphic Designers!
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Are you a creative mind who loves editing, motion design, or
            branding? Botfolio wants you! If you're a reel wizard or a design
            rockstar — let’s collaborate.
          </p>

          <div className="text-center">
            <a
              href="mailto:infobotfolio@gmail.com?subject=Application%20for%20Video%20Editor%2FGraphic%20Designer%20Role"
              className="inline-block bg-[#F4A100] text-black font-semibold px-6 py-3 rounded-sm hover:bg-yellow-400 transition-all"
            >
              📩 Apply via Email
            </a>
          </div>
        </div>

        {/* Didn't find your role form */}
        <div className="mt-16 bg-[#f4f4f4] p-8 rounded-sm shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-2 text-[#F4A100]">
            Didn't find your role?
          </h2>
          <p className="text-gray-700 mb-4">
            We’re always looking for passionate people. Send us your portfolio
            or resume and we’ll get back to you.
          </p>

          <form
            className="grid md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="bg-white border border-gray-300 text-black px-4 py-3 rounded-sm focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="bg-white border border-gray-300 text-black px-4 py-3 rounded-sm focus:outline-none"
              required
            />
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="LinkedIn / Portfolio URL"
              className="md:col-span-2 bg-white border border-gray-300 text-black px-4 py-3 rounded-sm focus:outline-none"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={4}
              className="md:col-span-2 bg-white border border-gray-300 text-black px-4 py-3 rounded-sm focus:outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-[#F4A100] text-black font-bold py-3 rounded-sm hover:bg-yellow-400 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Application
            </button>
          </form>
        </div>
      </div>
    </div>
     
   </>
   // </LenisScrollWrapper>
  );
};

export default Careers;
