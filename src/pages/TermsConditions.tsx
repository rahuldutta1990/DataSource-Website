import React from 'react';
import { Eyebrow } from '../components/Eyebrow.js';

export const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <Eyebrow text="Terms of Service" variant="blue" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B2B] dark:text-white font-heading">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Effective Date: January 1, 2026</p>

          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-body space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">1. Introduction</h2>
            <p>
              Welcome to the website of DataSource Technology &amp; Solutions. By accessing or using our website, you agree to comply with and be bound by these Terms &amp; Conditions.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">2. Professional Services Engagements</h2>
            <p>
              Informational materials on this website do not constitute a formal contract or binding engineering commitment. All technical engagements, deliverables, milestones, and warranties are governed by separate Master Services Agreements (MSA) and Statements of Work (SOW) executed between authorized representatives of both parties.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">3. Intellectual Property Rights</h2>
            <p>
              All trademarks, logos, brand assets, and custom editorial content published on this website are the property of DataSource Technology &amp; Solutions and may not be reproduced without prior written permission.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">4. Contact Information</h2>
            <p>
              For legal inquiries, contact{' '}
              <a href="mailto:legal@datasource.tech" className="text-[#0077FF] dark:text-[#38BDF8] font-semibold underline">
                legal@datasource.tech
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
