import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Truck,
  Users,
  UserCheck,
  ClipboardList,
  ShoppingCart,
  CheckCircle,
  Package,
  Timer,
  TrendingUp,
  DollarSign,
  Calendar,
  UserPlus,
  Repeat,
  BarChart3,
  Heart
} from 'lucide-react';

const HeroSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get('');
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const numberFormatter = new Intl.NumberFormat('en-IN');

  const metricCards = [
    {
      label: 'Delivered Orders',
      value: stats?.deliveredCount,
      icon: <CheckCircle className="text-green-600 w-6 h-6" />,
      color: 'border-green-500',
    },
    {
      label: 'Out for Delivery',
      value: stats?.outForDeliveryCount,
      icon: <Truck className="text-yellow-600 w-6 h-6" />,
      color: 'border-yellow-500',
    },
    {
      label: 'Picked Orders',
      value: stats?.pickedCount,
      icon: <Package className="text-blue-600 w-6 h-6" />,
      color: 'border-blue-500',
    },
    {
      label: 'Assigned Orders',
      value: stats?.assignedCount,
      icon: <ClipboardList className="text-orange-600 w-6 h-6" />,
      color: 'border-orange-500',
    },
    {
      label: 'Placed Orders',
      value: stats?.placedCount,
      icon: <ClipboardList className="text-orange-600 w-6 h-6" />,
      color: 'border-orange-500',
    },
    {
      label: 'Paid Orders',
      value: stats?.paymentStatusCount,
      icon: <CheckCircle className="text-green-600 w-6 h-6" />,
      color: 'border-green-500',
    },
    {
      label: "Today's Orders",
      value: stats?.todayOrdersCount,
      icon: <Calendar className="text-indigo-600 w-6 h-6" />,
      color: 'border-indigo-500',
    },
    {
      label: 'Avg. Order Value',
      value: `₹${stats?.averageOrderValue}`,
      icon: <TrendingUp className="text-pink-600 w-6 h-6" />,
      color: 'border-pink-500',
    },
    {
      label: 'Fulfillment Rate',
      value: `${stats?.fulfillmentRate}%`,
      icon: <Timer className="text-teal-600 w-6 h-6" />,
      color: 'border-teal-500',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers,
      icon: <Users className="text-violet-600 w-6 h-6" />,
      color: 'border-violet-500',
    },
    {
      label: 'New Users Today',
      value: stats?.newUsersToday,
      icon: <UserPlus className="text-emerald-600 w-6 h-6" />,
      color: 'border-emerald-500',
    },
    {
      label: 'New Users This Week',
      value: stats?.newUsersThisWeek,
      icon: <UserPlus className="text-cyan-600 w-6 h-6" />,
      color: 'border-cyan-500',
    },
    {
      label: 'New Users This Month',
      value: stats?.newUsersThisMonth,
      icon: <UserPlus className="text-indigo-600 w-6 h-6" />,
      color: 'border-indigo-500',
    },
    {
      label: 'Retention Rate',
      value: `${stats?.retentionRate}%`,
      icon: <Repeat className="text-purple-600 w-6 h-6" />,
      color: 'border-purple-500',
    },
    {
  label: 'Wishlist Items',
  value: stats?.wishListCount,
  icon: <Heart className="text-red-500 w-6 h-6" />,
  color: 'border-red-500',
},


    {
      label: 'Delivery Partners',
      value: stats?.totalDeliveryPartners,
      icon: <UserCheck className="text-emerald-600 w-6 h-6" />,
      color: 'border-emerald-500',
    },
    {
      label: 'Available Partners',
      value: stats?.availableDeliveryPartners,
      icon: <UserCheck className="text-sky-600 w-6 h-6" />,
      color: 'border-sky-500',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts,
      icon: <ShoppingCart className="text-violet-600 w-6 h-6" />,
      color: 'border-violet-500',
    },
    {
      label: 'Total Sales',
      value: `₹${numberFormatter.format(stats?.totalSales || 0)}`,
      icon: <DollarSign className="text-rose-600 w-6 h-6" />,
      color: 'border-rose-500',
    },
    {
      label: "Today's Revenue",
      value: `₹${numberFormatter.format(stats?.todaysRevenue || 0)}`,
      icon: <DollarSign className="text-lime-600 w-6 h-6" />,
      color: 'border-lime-500',
    },
  ];

  if (loading) {
    return (
      <section className="p-6 bg-white shadow rounded-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">Loading metrics...</p>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metricCards.map(({ label, value, icon, color }, idx) => (
          <div
            key={idx}
            className={`bg-white ${color} border-l-4 rounded-2xl shadow-md p-5 flex flex-col justify-center gap-2 transition duration-300 hover:scale-[1.02]`}
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
