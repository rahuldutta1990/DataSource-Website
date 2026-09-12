import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Phone, Mail } from 'lucide-react';
import { DataSourceLogo } from './DataSourceLogo.js';
import { ServiceCategory } from '../types.js';
import { api } from '../services/api.js';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    api.getServiceCategories().then(setCategories).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Insights', path: '/insights' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top micro-bar for direct contact confidence */}
      <div className="bg-[#0B1B2B] text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-cyan-400 font-semibold tracking-wide uppercase text-[11px]">
              Technology That Solves. Data That Drives.
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">We start with the problem, not the technology.</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@datasource.tech"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>contact@datasource.tech</span>
            </a>
            <a
              href="tel:+18005123282"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+1 (800) 512-3282</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
            : 'bg-white border-b border-slate-100 py-4 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none" aria-label="DataSource Home">
            <DataSourceLogo className="h-9 sm:h-10 md:h-11 w-auto max-w-[280px] sm:max-w-[340px]" showTagline={!isScrolled} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isActive(link.path)
                          ? 'text-[#0066FF] bg-[#0066FF]/5'
                          : 'text-[#1E293B] hover:text-[#0066FF] hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200/90 py-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Pillars</p>
                        </div>
                        <div className="p-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/services?category=${cat.id}`}
                              className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                              <div className="text-sm font-semibold text-slate-800 group-hover:text-[#0066FF] transition-colors">
                                {cat.name}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{cat.description}</p>
                            </Link>
                          ))}
                          <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                            <Link
                              to="/services"
                              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
                            >
                              View All 8+ Technology Services <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-[#0066FF] bg-[#0066FF]/5'
                      : 'text-[#1E293B] hover:text-[#0066FF] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow transition-all group active:scale-98"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/contact"
              className="bg-[#0077FF] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Consult
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-[#0077FF]/10 text-[#0066FF]'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-full text-center bg-[#0077FF] text-white py-3 rounded-xl font-semibold text-sm shadow flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                <span>Direct: contact@datasource.tech • +1 (800) 512-3282</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
