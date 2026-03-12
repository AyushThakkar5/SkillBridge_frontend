import { useState } from "react";
import { FiAward, FiMail, FiMapPin, FiPhone, FiTarget, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import Navbar from "./Navbar";

const Home = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      alert(`Message sent! Thanks, ${form.name}.`);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#f3f4f6]">
      <Navbar />
      <section id="home" className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 bg-white border-b border-gray-200 overflow-hidden">
        <div className="max-w-4xl space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0a66c2] text-sm font-semibold mb-4">🚀 The Future of Hiring is Here</div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">Build Your Career With <br /><span className="text-[#0a66c2]">SkillBridge</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">The ultimate platform connecting talented professionals with world-class companies.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/register-email" className="bg-[#0a66c2] text-white py-3 px-10 rounded-full font-semibold hover:bg-[#004182] transition shadow-md">Get Started Now</Link>
            <NavHashLink smooth to="/#about" className="border border-[#0a66c2] text-[#0a66c2] py-3 px-10 rounded-full font-semibold hover:bg-blue-50 transition">Learn More</NavHashLink>
          </div>
        </div>
      </section>
      <section id="about" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">We Are SkillBridge</h2>
          <p className="text-slate-600">We bridge the gap between talent and opportunity by focusing on actual skills.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon={<FiTarget />} title="Our Mission" desc="To democratize employment by making skills the primary currency." />
          <FeatureCard icon={<FiUsers />} title="Our Community" desc="A growing network of over 10,000 skilled professionals." />
          <FeatureCard icon={<FiAward />} title="Our Values" desc="Transparency, inclusivity, and continuous growth." />
        </div>
      </section>
      <section id="contact" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-12 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-800">Let's Talk</h2>
            <div className="space-y-6">
              <ContactItem icon={<FiMail />} title="Email Us" info="support@skillbridge.com" />
              <ContactItem icon={<FiPhone />} title="Call Us" info="+1 (555) 123-4567" />
              <ContactItem icon={<FiMapPin />} title="Visit Us" info="123 Innovation Dr, Tech City" />
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name" required className="w-full px-4 py-2 rounded border border-gray-300 text-slate-800 focus:ring-1 focus:ring-blue-600 outline-none" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            <input type="email" placeholder="Email Address" required className="w-full px-4 py-2 rounded border border-gray-300 text-slate-800 focus:ring-1 focus:ring-blue-600 outline-none" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            <textarea rows="4" placeholder="How can we help?" required className="w-full px-4 py-2 rounded border border-gray-300 text-slate-800 focus:ring-1 focus:ring-blue-600 outline-none resize-none" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
            <button type="submit" className="w-full bg-[#0a66c2] text-white py-3 rounded-lg font-semibold hover:bg-[#004182] transition shadow-md">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition duration-200">
    <div className="text-[#0a66c2] text-3xl mb-4 flex justify-center">{icon}</div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

const ContactItem = ({ icon, title, info }) => (
  <div className="flex items-start gap-4">
    <div className="text-[#0a66c2] text-2xl mt-1 flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-slate-800 font-bold">{title}</h3>
      <p className="text-slate-500 text-sm">{info}</p>
    </div>
  </div>
);

export default Home;