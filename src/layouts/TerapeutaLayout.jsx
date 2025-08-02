import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TerapeutaLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}