import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../components/Eyebrow.js';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <Eyebrow text="Legal Compliance" variant="blue" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Effective Date: January 1, 2026</p>

          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-body space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">1. Commitment to Privacy</h2>
            <p>
              DataSource Technology &amp; Solutions (&ldquo;DataSource&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting the confidentiality, integrity, and security of information provided by our clients, website visitors, and partners.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">2. Information We Collect</h2>
            <p>
              We collect information that you voluntarily submit through our consultation request forms, including your name, corporate email address, telephone number, organization name, and technical project descriptions.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">3. How Information Is Used</h2>
            <p>
              We use information collected strictly to evaluate technical problem statements, prepare scoping proposals, schedule discovery calls, and deliver authorized consulting services. We do not sell, rent, or trade your contact details to third parties.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">4. Confidentiality &amp; NDAs</h2>
            <p>
              All proprietary project requirements and data shared during consultations are held under strict confidentiality. We routinely execute mutual Non-Disclosure Agreements (NDAs) prior to detailed architecture reviews.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">5. Contact Us</h2>
            <p>
              For questions regarding our privacy practices, please contact us at{' '}
              <a href="mailto:rd14190@gmail.com" className="text-[#0077FF] dark:text-[#38BDF8] font-semibold underline">
                rd14190@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
