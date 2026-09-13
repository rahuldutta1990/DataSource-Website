import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { GoogleMapsSection } from './GoogleMapsSection.js';
import { AmbientTechBackground } from './AmbientTechBackground.js';
import { WhatsAppChatbot } from './WhatsAppChatbot.js';
import { GeminiChatbot } from './GeminiChatbot.js';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFF] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 selection:bg-[#0077FF] selection:text-white transition-colors duration-200 relative overflow-x-clip">
      {/* Global Ambient Interactive Tech Canvas & Glowing Auroras */}
      <AmbientTechBackground />

      <div className="relative z-10 flex flex-col min-h-screen overflow-x-clip">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <GoogleMapsSection />
        <Footer />
        <GeminiChatbot />
        <WhatsAppChatbot />
      </div>
    </div>
  );
};
