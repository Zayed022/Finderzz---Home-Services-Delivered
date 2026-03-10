// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, IndianRupee, X } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bike,
  Tag,
  Settings,
  Heart,
  Image,
  Megaphone
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={24} />, to: '/' },
    { name: 'Services', icon: <Package size={24} />, to: '/services' },
    { name: 'Bookings', icon: <ShoppingCart size={24} />, to: '/bookings' },
    { name: "Area", icon: <Heart size={24} />, to: "/area" },
    { name: 'Users', icon: <Users size={24} />, to: '/users' },
    { name: 'Delivery Partners', icon: <Bike size={24} />, to: '/delivery-partners' },
    { name: 'Shop', icon: <Package size={24} />, to: '/shop' },
    { name: 'Banner', icon: <Image size={24} />, to: '/banner' },
    { name: 'Notice', icon: <Megaphone size={24} />, to: '/notice' },
    { name: 'Offers', icon: <Tag size={24} />, to: '/offers' },
    { name: 'Notifications', icon: <Bell  size={24} />, to: '/notification' },
    { name: 'Fee', icon: <IndianRupee  size={24} />, to: '/fee' },
    { name: 'Settings', icon: <Settings size={24} />, to: '/settings' },
  ];

  return (
    <>
      {/* Mobile Sidebar (slide-in) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Close button (only mobile) */}
        <div className="flex justify-between items-center px-4 py-3 border-b md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-1 px-4 py-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'}`
              }
              onClick={onClose} // auto close after click (mobile)
            >
              {item.icon}
              <span className="text-base">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
