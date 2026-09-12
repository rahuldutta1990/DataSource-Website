import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Mail,
  Phone,
  Sun,
  Moon,
} from 'lucide-react';
import { DataSourceLogo } from './DataSourceLogo.js';
import { ServiceCategory } from '../types.js';
import { api } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.js';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
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
            ? 'bg-white/95 dark:bg-[#080E1A]/95 backdrop-blur-md shadow-sm dark:shadow-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/90 py-3.5'
            : 'bg-white dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/60 py-4 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Proportional & Cleanly Scaled */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none shrink-0" aria-label="DataSource Home">
            <DataSourceLogo
              variant={isDark ? 'white-horizontal' : 'horizontal'}
              className="h-8 sm:h-9 md:h-9.5 lg:h-10 w-auto"
              showTagline={false}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0 whitespace-nowrap">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative shrink-0"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors shrink-0 ${
                        isActive(link.path)
                          ? 'text-[#0066FF] dark:text-[#38BDF8] bg-[#0066FF]/5 dark:bg-[#38BDF8]/10'
                          : 'text-[#1E293B] dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="whitespace-nowrap">{link.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 bg-white dark:bg-[#0F1A2C] rounded-xl shadow-xl dark:shadow-2xl border border-slate-200/90 dark:border-slate-800 py-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Our Pillars</p>
                        </div>
                        <div className="p-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/services?category=${cat.id}`}
                              className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                            >
                              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-colors">
                                {cat.name}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{cat.description}</p>
                            </Link>
                          ))}
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 px-2">
                            <Link
                              to="/services"
                              className="text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1"
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
                  className={`whitespace-nowrap shrink-0 px-3 xl:px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-[#0066FF] dark:text-[#38BDF8] bg-[#0066FF]/5 dark:bg-[#38BDF8]/10'
                      : 'text-[#1E293B] dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Header Action & Theme Switcher (Sign-in removed per user specification) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-[#0077FF] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#0077FF]/30"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] dark:bg-[#0077FF] dark:hover:bg-[#0066EE] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow transition-all group active:scale-98"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Actions: Theme Toggle & Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link
              to="/contact"
              className="bg-[#0077FF] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Consult
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09101C] px-4 pt-3 pb-6 space-y-2 shadow-lg dark:shadow-2xl animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-[#0077FF]/10 dark:bg-[#38BDF8]/15 text-[#0066FF] dark:text-[#38BDF8]'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Appearance row */}
            <div className="pt-2 pb-2 px-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Appearance</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-full text-center bg-[#0077FF] text-white py-3 rounded-xl font-semibold text-sm shadow flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <span>Direct: contact@datasource.tech • +1 (800) 512-3282</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
