// src/pages/Home.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';


const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Sidebar - hidden on mobile, toggle with button */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-y-auto">
          <HeroSection />
          
        </main>
      </div>
    </div>
  );
};

export default Home;
