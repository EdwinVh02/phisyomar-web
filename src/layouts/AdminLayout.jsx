import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
