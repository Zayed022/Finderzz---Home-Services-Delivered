import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Truck,
  ClipboardList,
  Package,
  Calendar,
  Users,
  UserCheck,
  Layers,
  BarChart3,
} from "lucide-react";
import API from "../api/api";

const HeroSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/worker/dashboard/stats"
      );

      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metricCards = [
    {
      label: "Completed Orders",
      value: stats?.orders?.completed || 0,
      icon: <CheckCircle className="text-green-600 w-6 h-6" />,
      color: "border-green-500",
    },
    {
      label: "In Progress Orders",
      value: stats?.orders?.inProgress || 0,
      icon: <Truck className="text-yellow-600 w-6 h-6" />,
      color: "border-yellow-500",
    },
    {
      label: "Assigned Orders",
      value: stats?.orders?.assigned || 0,
      icon: <ClipboardList className="text-orange-600 w-6 h-6" />,
      color: "border-orange-500",
    },
    {
      label: "Pending Orders",
      value: stats?.orders?.pending || 0,
      icon: <Package className="text-blue-600 w-6 h-6" />,
      color: "border-blue-500",
    },
    {
      label: "Today's Orders",
      value: stats?.orders?.today || 0,
      icon: <Calendar className="text-indigo-600 w-6 h-6" />,
      color: "border-indigo-500",
    },
    {
      label: "Approved Workers",
      value: stats?.workers?.approved || 0,
      icon: <UserCheck className="text-emerald-600 w-6 h-6" />,
      color: "border-emerald-500",
    },
    {
      label: "Pending Workers",
      value: stats?.workers?.pending || 0,
      icon: <Users className="text-red-500 w-6 h-6" />,
      color: "border-red-500",
    },
    {
      label: "Total Services",
      value: stats?.services?.totalServices || 0,
      icon: <Layers className="text-violet-600 w-6 h-6" />,
      color: "border-violet-500",
    },
    {
      label: "Total Sub Services",
      value: stats?.services?.totalSubServices || 0,
      icon: <BarChart3 className="text-cyan-600 w-6 h-6" />,
      color: "border-cyan-500",
    },
    {
      label: "Pending Settlements",
      value: stats?.settlements?.pending || 0,
      icon: <ClipboardList className="text-pink-600 w-6 h-6" />,
      color: "border-pink-500",
    },
  ];

  if (loading) {
    return (
      <section className="p-6 bg-white shadow rounded-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">Loading metrics...</p>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        📊 Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metricCards.map(({ label, value, icon, color }, idx) => (
          <div
            key={idx}
            className={`bg-white ${color} border-l-4 rounded-2xl shadow-md p-5 flex flex-col gap-2 transition duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-md font-medium text-gray-600">{label}</h3>
            </div>

            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;