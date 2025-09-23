'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Award,
  Target,
  Globe
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import SimplePasswordProtection from '../../../components/SimplePasswordProtection';

interface CharityEvent {
  id: string;
  eventName: string;
  artistName: string;
  venue: string;
  date: string;
  totalRevenue: number;
  charityAmount: number;
  upliftPercentage: number;
  ticketsSold: number;
  beneficiaries: string[];
}

interface ImpactMetrics {
  totalFundsRaised: number;
  totalEvents: number;
  totalBeneficiaries: number;
  averageUplift: number;
  topCause: string;
  monthlyGrowth: number;
}

interface CauseDistribution {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  [key: string]: string | number; // Allow index signature for recharts compatibility
}

export default function CharityDashboard() {
  const [events, setEvents] = useState<CharityEvent[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      const mockEvents: CharityEvent[] = [
        {
          id: 'lady-gaga-kl',
          eventName: 'One Night in KL',
          artistName: 'Lady Gaga',
          venue: 'KLCC Arena',
          date: '2025-12-15',
          totalRevenue: 47500,
          charityAmount: 2375,
          upliftPercentage: 5,
          ticketsSold: 245,
          beneficiaries: ['Mental Health Foundation', 'LGBTQ+ Youth Support']
        },
        {
          id: 'lady-gaga-sg',
          eventName: 'Singapore Concert',
          artistName: 'Lady Gaga',
          venue: 'Marina Bay Sands',
          date: '2025-12-18',
          totalRevenue: 89200,
          charityAmount: 4460,
          upliftPercentage: 5,
          ticketsSold: 412,
          beneficiaries: ['Mental Health Foundation', 'Born This Way Foundation']
        },
        {
          id: 'taylor-swift-my',
          eventName: 'Eras Tour Malaysia',
          artistName: 'Taylor Swift',
          venue: 'Bukit Jalil Stadium',
          date: '2025-11-28',
          totalRevenue: 156000,
          charityAmount: 15600,
          upliftPercentage: 10,
          ticketsSold: 780,
          beneficiaries: ['Education for All', 'Wildlife Conservation']
        },
        {
          id: 'ed-sheeran-th',
          eventName: 'Mathematics Tour',
          artistName: 'Ed Sheeran',
          venue: 'Impact Arena Bangkok',
          date: '2025-10-15',
          totalRevenue: 98400,
          charityAmount: 7380,
          upliftPercentage: 7.5,
          ticketsSold: 520,
          beneficiaries: ['Music Education Fund', 'Children\'s Hospital Fund']
        }
      ];

      setEvents(mockEvents);

      const totalFunds = mockEvents.reduce((sum, event) => sum + event.charityAmount, 0);
      const totalBeneficiaries = new Set(mockEvents.flatMap(event => event.beneficiaries)).size;
      const avgUplift = mockEvents.reduce((sum, event) => sum + event.upliftPercentage, 0) / mockEvents.length;

      setMetrics({
        totalFundsRaised: totalFunds,
        totalEvents: mockEvents.length,
        totalBeneficiaries,
        averageUplift: avgUplift,
        topCause: 'Mental Health Foundation',
        monthlyGrowth: 23.5
      });

      setLoading(false);
    }, 500);
  }, []);

  // Chart data
  const monthlyData = [
    { month: 'Jul', amount: 1250, events: 2 },
    { month: 'Aug', amount: 2890, events: 3 },
    { month: 'Sep', amount: 4120, events: 4 },
    { month: 'Oct', amount: 7380, events: 6 },
    { month: 'Nov', amount: 15600, events: 8 },
    { month: 'Dec', amount: 29820, events: 12 }
  ];

  const causeDistribution: CauseDistribution[] = [
    { name: 'Mental Health', amount: 8235, percentage: 28, color: '#026cdf' },
    { name: 'Education', amount: 7020, percentage: 24, color: '#33b8aa' },
    { name: 'Environment', amount: 5850, percentage: 20, color: '#10b981' },
    { name: 'Children\'s Welfare', amount: 4680, percentage: 16, color: '#f59e0b' },
    { name: 'Healthcare', amount: 3510, percentage: 12, color: '#ef4444' }
  ];

  const COLORS = ['#026cdf', '#33b8aa', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading impact data...</p>
        </div>
      </div>
    );
  }

  return (
    <SimplePasswordProtection
      title="Charity Dashboard Access"
      description="Enter the password to access the charity dashboard"
      storageKey="charityAuthenticated"
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
          <h1 className="text-2xl font-bold">Charity Dashboard</h1>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
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
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-brand-400 to-primary bg-clip-text text-transparent">
            Making Real Impact
          </h2>
          <p className="text-xl text-gray-300">Track the positive change generated through music events</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6" />
              <h3 className="font-semibold">Total Funds Raised</h3>
            </div>
            <p className="text-3xl font-bold">${metrics?.totalFundsRaised.toLocaleString()}</p>
            <p className="text-brand-100 text-sm mt-1">+{metrics?.monthlyGrowth}% this month</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-gray-300">Events Supported</h3>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.totalEvents}</p>
            <p className="text-gray-400 text-sm mt-1">Active partnerships</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-gray-300">Beneficiaries</h3>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.totalBeneficiaries}</p>
            <p className="text-gray-400 text-sm mt-1">Organizations helped</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h3 className="font-semibold text-gray-300">Avg. Uplift Rate</h3>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.averageUplift.toFixed(1)}%</p>
            <p className="text-gray-400 text-sm mt-1">Artist generosity</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Funds Raised Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold mb-6">Funds Raised Over Time</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
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
                    formatter={(value, name) => [
                      name === 'amount' ? `$${value.toLocaleString()}` : value,
                      name === 'amount' ? 'Funds Raised' : 'Events'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#33b8aa"
                    fill="url(#colorAmount)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#33b8aa" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#33b8aa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cause Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold mb-6">Impact by Cause</h3>

            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={causeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {causeDistribution.map((entry, index) => (
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
                    formatter={(value, name) => [`$${value.toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {causeDistribution.map((cause, index) => (
                <div key={cause.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="text-gray-300">{cause.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${cause.amount.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm ml-2">({cause.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Contributing Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Top Contributing Events</h3>
            <div className="text-sm text-gray-400">
              Real-time updates from artist uplift settings
            </div>
          </div>

          <div className="space-y-4">
            {events
              .sort((a, b) => b.charityAmount - a.charityAmount)
              .map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-700 rounded-lg p-4 hover:border-brand-400/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {index < 3 && (
                          <Award className={`w-5 h-5 ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-300' : 'text-orange-400'
                          }`} />
                        )}
                        <h4 className="text-xl font-semibold">{event.eventName}</h4>
                      </div>
                      <p className="text-gray-400">
                        {event.artistName} • {event.venue}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/event/${event.id}`}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      View Event
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Charity Raised</p>
                      <p className="text-lg font-bold text-brand-400">${event.charityAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Uplift Rate</p>
                      <p className="text-lg font-bold">{event.upliftPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Revenue</p>
                      <p className="text-lg font-bold text-primary">${event.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Tickets Sold</p>
                      <p className="text-lg font-bold">{event.ticketsSold}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Beneficiaries:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.beneficiaries.map((beneficiary) => (
                        <span
                          key={beneficiary}
                          className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-sm"
                        >
                          {beneficiary}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-brand-500 to-primary rounded-xl p-8 text-center text-white"
        >
          <Target className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">
            ${metrics?.totalFundsRaised.toLocaleString()} Raised for Good Causes
          </h3>
          <p className="text-xl mb-4">
            Through {metrics?.totalEvents} events, we've supported {metrics?.totalBeneficiaries} organizations making real impact in communities worldwide.
          </p>
          <p className="text-lg opacity-90">
            Every ticket sold contributes to positive change. Thank you for being part of this movement.
          </p>
        </motion.div>
      </div>
    </div>
    </SimplePasswordProtection>
  );
}