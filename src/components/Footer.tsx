import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Clock, Linkedin, Twitter, Github } from 'lucide-react';
import { DataSourceLogo } from './DataSourceLogo.js';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1B2B] text-slate-300 border-t border-slate-800">
      {/* Upper CTA Consultation Banner */}
      <div className="border-b border-slate-800/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0E2439] to-[#0A387E] rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-700/60 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Background graphic glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#0077FF]/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Next Steps</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Have a Technology or Data Problem?
              </h2>
              <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                Let&apos;s understand the challenge first and find the right solution together. We start with your business goals, not pre-packaged software licenses.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0066E0] text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-4 rounded-xl font-bold text-base transition-colors"
              >
                <span>Explore Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block focus:outline-none" aria-label="DataSource Home">
              <DataSourceLogo variant="white-horizontal" className="h-10 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              DataSource is a technology and data consulting partner helping businesses solve technical problems, build digital products, improve operations, and turn data into useful business decisions.
            </p>
            <div className="pt-2 text-xs text-cyan-400 font-semibold tracking-wide">
              Brand Philosophy: &ldquo;We start with the problem, not the technology.&rdquo;
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com/company/datasource-tech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#0077FF] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="DataSource LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/datasourcetech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#0077FF] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="DataSource Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/datasource-tech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#0077FF] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="DataSource GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">
              Technology Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/custom-web-cloud-applications" className="hover:text-cyan-400 transition-colors">
                  Web &amp; Cloud Applications
                </Link>
              </li>
              <li>
                <Link to="/services/ui-ux-product-design" className="hover:text-cyan-400 transition-colors">
                  UI/UX &amp; Product Design
                </Link>
              </li>
              <li>
                <Link to="/services/power-bi-executive-dashboards" className="hover:text-cyan-400 transition-colors">
                  Power BI &amp; Dashboards
                </Link>
              </li>
              <li>
                <Link to="/services/data-analytics-predictive-insights" className="hover:text-cyan-400 transition-colors">
                  Data Analytics &amp; Modeling
                </Link>
              </li>
              <li>
                <Link to="/services/data-engineering-pipeline-automation" className="hover:text-cyan-400 transition-colors">
                  Data Pipelines &amp; ETL
                </Link>
              </li>
              <li>
                <Link to="/services/it-consulting-technology-assessment" className="hover:text-cyan-400 transition-colors">
                  IT Strategy &amp; Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  About DataSource
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-cyan-400 transition-colors">
                  Case Studies &amp; Results
                </Link>
              </li>
              <li>
                <Link to="/about#process" className="hover:text-cyan-400 transition-colors">
                  The DataSource Way
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-cyan-400 transition-colors">
                  Insights &amp; Engineering Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contacts Column */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">Innovation Quarter, Tech Park Plaza</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:contact@datasource.tech" className="hover:text-cyan-400 transition-colors">
                  contact@datasource.tech
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+18005123282" className="hover:text-cyan-400 transition-colors font-medium">
                  +1 (800) 512-3282
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM EST</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Admin Bar */}
      <div className="border-t border-slate-800/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DataSource Technology &amp; Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/admin/login" className="text-slate-600 hover:text-cyan-400 transition-colors font-medium">
              CMS Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
