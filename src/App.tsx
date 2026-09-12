/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.js';
import { ScrollToTop } from './components/ScrollToTop.js';
import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Services } from './pages/Services.js';
import { ServiceDetail } from './pages/ServiceDetail.js';
import { CaseStudies } from './pages/CaseStudies.js';
import { CaseStudyDetail } from './pages/CaseStudyDetail.js';
import { Insights } from './pages/Insights.js';
import { InsightDetail } from './pages/InsightDetail.js';
import { Contact } from './pages/Contact.js';
import { PrivacyPolicy } from './pages/PrivacyPolicy.js';
import { TermsConditions } from './pages/TermsConditions.js';
import { AdminLogin } from './pages/admin/AdminLogin.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Site Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

