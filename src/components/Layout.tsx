import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.js';
import { Footer } from './Footer.js';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#0077FF] selection:text-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
