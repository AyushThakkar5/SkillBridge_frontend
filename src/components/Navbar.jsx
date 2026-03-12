import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { logAuth, isAuthenticated, employerAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = location.hash.replace('#', '');
      if (hash === 'about' || hash === 'contact') {
        scrollToSection(hash);
      } else if (location.pathname === '/') {
        scrollToTopSmoothly();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const scrollToTopSmoothly = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollToTopSmoothly();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-slate-100 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        <Link to="/" onClick={scrollToTopSmoothly} className="text-xl sm:text-2xl font-bold text-[#0a66c2] tracking-tighter">
          Skill<span className="text-slate-800">Bridge</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-[#0a66c2]">Home</Link>
          <Link to="/#about" className="text-sm font-medium text-slate-600 hover:text-[#0a66c2]">About</Link>
          <Link to="/#contact" className="text-sm font-medium text-slate-600 hover:text-[#0a66c2]">Contact</Link>
          {(isAuthenticated || employerAuth) && (
            <NavLink to={employerAuth ? "/employer-dashboard" : "/candidate-dashboard"} className="text-sm font-medium text-slate-600 hover:text-[#0a66c2]">
              Dashboard
            </NavLink>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {!logAuth ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Log in</Link>
              <Link to="/register-email" className="bg-[#0a66c2] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-[#084d91] transition">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition">Log out</button>
          )}
        </div>
        <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg px-6 py-4 space-y-4">
          <Link to="/" className="block text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/#about" className="block text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/#contact" className="block text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {!logAuth ? (
            <div className="pt-4 border-t flex flex-col gap-3">
              <Link to="/login" className="text-center py-2 text-slate-700 font-semibold" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              <Link to="/register-email" className="text-center bg-[#0a66c2] text-white py-2 rounded-lg font-semibold" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          ) : (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left text-red-600 font-semibold py-2">Log out</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;