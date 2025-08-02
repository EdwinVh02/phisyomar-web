import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
