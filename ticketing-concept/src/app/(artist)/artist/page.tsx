'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Users, TrendingUp, Heart, Settings, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import SimplePasswordProtection from '../../../components/SimplePasswordProtection';

interface EventMetrics {
  id: string;
  name: string;
  venue: string;
  date: string;
  totalRevenue: number;
  ticketsSold: number;
  totalTickets: number;
  charityAmount: number;
  upliftPercentage: number;
}

interface Split {
  platform: number;
  artist: number;
  charity: number;
}

export default function ArtistDashboard() {
  const [upliftPercentage, setUpliftPercentage] = useState(5);
  const [events, setEvents] = useState<EventMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        {
          id: 'lady-gaga-kl',
          name: 'One Night in KL',
          venue: 'KLCC Arena',
          date: '2025-12-15',
          totalRevenue: 47500,
          ticketsSold: 245,
          totalTickets: 550,
          charityAmount: 2375,
          upliftPercentage: 5
        },
        {
          id: 'lady-gaga-sg',
          name: 'Singapore Concert',
          venue: 'Marina Bay Sands',
          date: '2025-12-18',
          totalRevenue: 89200,
          ticketsSold: 412,
          totalTickets: 600,
          charityAmount: 4460,
          upliftPercentage: 5
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const calculateSplit = (percentage: number): Split => {
    const platformFee = 8; // Fixed 8% platform fee
    const charity = percentage;
    const artist = 100 - platformFee - charity;

    return {
      platform: platformFee,
      artist,
      charity
    };
  };

  const split = calculateSplit(upliftPercentage);

  const totalRevenue = events.reduce((sum, event) => sum + event.totalRevenue, 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);
  const totalCharityAmount = events.reduce((sum, event) => sum + event.charityAmount, 0);

  // Chart data
  const pieData = [
    { name: 'Artist Revenue', value: split.artist, color: '#026cdf' },
    { name: 'Charity Impact', value: split.charity, color: '#33b8aa' },
    { name: 'Platform Fee', value: split.platform, color: '#6b7280' }
  ];

  const salesData = [
    { month: 'Sep', revenue: 12500, tickets: 85 },
    { month: 'Oct', revenue: 24300, tickets: 156 },
    { month: 'Nov', revenue: 45800, tickets: 287 },
    { month: 'Dec', revenue: 67200, tickets: 412 }
  ];

  const COLORS = ['#026cdf', '#33b8aa', '#6b7280'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SimplePasswordProtection
      title="General Artist Dashboard Access"
      description="Enter the password to access the general artist dashboard"
      storageKey="generalArtistAuthenticated"
    >
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Artist Portal</h1>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2">Welcome back, Lady Gaga</h2>
          <p className="text-xl text-gray-300">Manage your events and track your impact</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-gray-300">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-brand-400" />
              <h3 className="font-semibold text-gray-300">Tickets Sold</h3>
            </div>
            <p className="text-3xl font-bold text-white">{totalTicketsSold.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="font-semibold text-gray-300">Charity Impact</h3>
            </div>
            <p className="text-3xl font-bold text-white">${totalCharityAmount.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-gray-300">Uplift Rate</h3>
            </div>
            <p className="text-3xl font-bold text-white">{upliftPercentage}%</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Split Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold mb-6">Revenue Split Control</h3>

            {/* Charity Uplift Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold">Charity Uplift Percentage</label>
                <span className="text-2xl font-bold text-brand-400">{upliftPercentage}%</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={upliftPercentage}
                  onChange={(e) => setUpliftPercentage(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #33b8aa 0%, #33b8aa ${upliftPercentage}%, #374151 ${upliftPercentage}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>0%</span>
                  <span>12.5%</span>
                  <span>25%</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-3">
                Adjust how much of ticket revenue goes to charity causes
              </p>
            </div>

            {/* Split Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="font-semibold">Artist Revenue</span>
                <span className="text-primary font-bold">{split.artist}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="font-semibold">Charity Impact</span>
                <span className="text-brand-400 font-bold">{split.charity}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="font-semibold">Platform Fee</span>
                <span className="text-gray-400 font-bold">{split.platform}%</span>
              </div>
            </div>
          </motion.div>

          {/* Revenue Split Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold mb-6">Revenue Split Visualization</h3>

            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-gray-300">{item.name}</span>
                  <span className="ml-auto font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-xl p-6 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">Sales Performance</h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#026cdf"
                  strokeWidth={3}
                  dot={{ fill: '#026cdf', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Events Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Your Events</h3>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Create Event
            </button>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-semibold">{event.name}</h4>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {event.venue}
                    </p>
                  </div>
                  <Link
                    href={`/event/${event.id}`}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    View Event
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-lg font-bold text-primary">${event.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tickets Sold</p>
                    <p className="text-lg font-bold">{event.ticketsSold} / {event.totalTickets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Charity Raised</p>
                    <p className="text-lg font-bold text-brand-400">${event.charityAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Uplift Rate</p>
                    <p className="text-lg font-bold">{event.upliftPercentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </SimplePasswordProtection>
  );
}