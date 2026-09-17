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
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DataSourceLogo } from './DataSourceLogo.js';
import { DynamicIcon } from './DynamicIcon.js';
import { AutoSearch } from './AutoSearch.js';
import { ServiceCategory, ServiceItem } from '../types.js';
import { api } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.js';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
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
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    api.getServiceCategories().then(setCategories).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'AI Studio', path: '/studio' },
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
              href="mailto:rd14190@gmail.com"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>rd14190@gmail.com</span>
            </a>
            <a
              href="tel:+919038417437"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+91 9038417437</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#080E1A]/95 backdrop-blur-md shadow-md dark:shadow-slate-950/50 border-b border-slate-200/80 dark:border-slate-800/90 py-2.5 lg:py-3'
            : 'bg-white dark:bg-[#070D18] border-b border-slate-100 dark:border-slate-800/60 py-4 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Proportional & Cleanly Scaled */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none shrink-0" aria-label="DataSource Home">
            <DataSourceLogo
              variant={isDark ? 'white-horizontal' : 'horizontal'}
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9 md:h-9.5 lg:h-10'}`}
              showTagline={false}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0 whitespace-nowrap">
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
                      className={`whitespace-nowrap inline-flex items-center gap-1 px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors shrink-0 ${
                        isActive(link.path)
                          ? 'text-[#0066FF] dark:text-[#38BDF8] bg-[#0066FF]/5 dark:bg-[#38BDF8]/10'
                          : 'text-[#1E293B] dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="whitespace-nowrap">{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-96 bg-white dark:bg-[#0F1A2C] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-[520px] overflow-y-auto">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">All Individual Service Pages</p>
                          <Link to="/services" className="text-xs text-[#0066FF] dark:text-[#38BDF8] font-semibold hover:underline">
                            View Hub
                          </Link>
                        </div>
                        <div className="p-2 space-y-1">
                          {services.map((svc) => (
                            <Link
                              key={svc.id || svc.slug}
                              to={`/services/${svc.slug}`}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-[#0066FF]/10 dark:bg-[#38BDF8]/15 text-[#0066FF] dark:text-[#38BDF8] shrink-0 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                                <DynamicIcon name={svc.iconName || 'Layers'} className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                                  {svc.title}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{svc.excerpt}</p>
                              </div>
                            </Link>
                          ))}
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 px-2">
                            <Link
                              to="/services"
                              className="w-full text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#0066FF] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>Explore All Services & Categories</span>
                              <ArrowRight className="w-3.5 h-3.5" />
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
                  className={`whitespace-nowrap shrink-0 px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
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
          <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 shrink-0">
            {/* Auto Search Bar */}
            <AutoSearch />

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-2 xl:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-[#0077FF] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#0077FF]/30 shrink-0"
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
              className="relative inline-flex items-center gap-1.5 xl:gap-2 bg-gradient-to-r from-[#0066FF] via-[#0077FF] to-[#00A3FF] hover:from-[#0055EE] hover:via-[#0066EE] hover:to-[#0090EE] text-white px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full text-xs xl:text-sm font-bold tracking-tight xl:tracking-wide shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 border border-blue-400/30 transition-all duration-200 group shrink-0 whitespace-nowrap active:scale-[0.98] overflow-hidden"
              id="header-book-consultant-btn"
            >
              {/* Subtle hover shine sweep */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-cyan-200 shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="whitespace-nowrap font-bold">Book a Consultant</span>
              <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-white/90 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile & Tablet Actions: Theme Toggle, Book Button & Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:hidden shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0066FF] to-[#00A3FF] hover:from-[#0055EE] hover:to-[#0090EE] text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm shadow-blue-500/25 border border-blue-400/30 shrink-0 whitespace-nowrap active:scale-95 transition-all"
              id="mobile-book-consultant-btn"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
              <span className="hidden sm:inline">Book a Consultant</span>
              <span className="sm:hidden">Book</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09101C] px-4 pt-3 pb-6 space-y-2 shadow-lg dark:shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
            {/* Mobile Auto Search */}
            <AutoSearch isMobile onSelectMobile={() => setMobileMenuOpen(false)} />

            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.name} className="space-y-1">
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <Link
                        to={link.path}
                        className="text-base font-semibold text-[#0066FF] dark:text-[#38BDF8]"
                      >
                        {link.name} (Hub)
                      </Link>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {mobileServicesOpen && (
                      <div className="pl-4 space-y-1 py-1 border-l-2 border-[#0066FF]/30 ml-2">
                        {services.map((svc) => (
                          <Link
                            key={svc.slug}
                            to={`/services/${svc.slug}`}
                            className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            • {svc.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
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
              );
            })}

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
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gradient-to-r from-[#0066FF] via-[#0077FF] to-[#00A3FF] hover:from-[#0055EE] hover:to-[#0090EE] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 group transition-all"
                id="drawer-book-consultant-btn"
              >
                <Calendar className="w-4 h-4 text-cyan-200 shrink-0" />
                <span className="whitespace-nowrap">Book a Consultant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <span>Direct: rd14190@gmail.com • +91 9038417437</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
