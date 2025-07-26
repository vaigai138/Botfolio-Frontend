import React from "react";
import { motion } from "framer-motion";
import {
  PiLightbulbFilamentFill,
  PiGearSixFill,
  PiGraphFill,
  PiRocketLaunchFill,
} from "react-icons/pi";

const steps = [
  {
    icon: <PiLightbulbFilamentFill size={36} className="text-[#FACC15]" />,
    title: "Ideate",
    description: "We dive into your needs and understand your workflow, goals, and creative challenges.",
  },
  {
    icon: <PiGearSixFill size={36} className="text-[#FACC15]" />,
    title: "Craft",
    description: "We design a seamless, user-friendly system tailored to creative professionals like you.",
  },
  {
    icon: <PiGraphFill size={36} className="text-[#FACC15]" />,
    title: "Fine-Tune",
    description: "Through testing and real feedback, we refine the features to fit your daily hustle.",
  },
  {
    icon: <PiRocketLaunchFill size={36} className="text-[#FACC15]" />,
    title: "Empower",
    description: "With everything optimized, you're ready to manage, deliver, and scale your creative work faster.",
  },
];


const HowItWorks = () => {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-sm shadow-md p-6 text-center hover:shadow-lg transition min-h-[260px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
