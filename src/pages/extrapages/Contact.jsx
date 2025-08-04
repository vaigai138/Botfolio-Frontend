import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
} from "lucide-react";
//import LenisScrollWrapper from "../../components/LenisScrollWrapper";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, mobile, message } = form;
    const mailtoLink = `mailto:infobotfolio@gmail.com?subject=Contact from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMobile: ${mobile || "Not Provided"}\n\n${message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
   // <LenisScrollWrapper>
    <div className="min-h-screen bg-white text-black px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Contact <span className="text-[#F4A100] pacifico-regular">Botfolio</span>
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Have questions, ideas, or feedback? We’d love to hear from you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[#f9f9f9] p-8 rounded-sm border border-gray-200 shadow-md space-y-6"
        >
          {/* Name Field */}
          <div className="flex items-center bg-white border border-gray-300 rounded-sm">
            <User className="w-5 h-5 ml-3 text-gray-500" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full px-4 py-3 outline-none bg-transparent text-black"
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center bg-white border border-gray-300 rounded-sm">
            <Mail className="w-5 h-5 ml-3 text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="w-full px-4 py-3 outline-none bg-transparent text-black"
            />
          </div>

          {/* Mobile Field (optional) */}
          <div className="flex items-center bg-white border border-gray-300 rounded-sm">
            <Phone className="w-5 h-5 ml-3 text-gray-500" />
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile (Optional)"
              className="w-full px-4 py-3 outline-none bg-transparent text-black"
            />
          </div>

          {/* Message Field */}
          <div className="flex items-start bg-white border border-gray-300 rounded-sm">
            <MessageSquare className="w-5 h-5 mt-4 ml-3 text-gray-500" />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 outline-none bg-transparent text-black"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#F4A100] text-black font-bold py-3 px-6 rounded-sm hover:bg-yellow-400 transition flex items-center justify-center gap-2 w-full"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  //  </LenisScrollWrapper>
  );
};

export default Contact;
