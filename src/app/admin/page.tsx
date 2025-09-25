'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  Ticket,
  Heart,
  Building2,
  Calendar,
  BarChart3,
  PieChart,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import AdminPasswordProtection from '../../components/AdminPasswordProtection';
import SimulationControls from '../../components/admin/SimulationControls';

interface PlatformSettings {
  id: string;
  platformFeePercentage: number;
  platformFeeFixed: number;
  allowCustomFees: boolean;
  minFeePercentage: number;
  maxFeePercentage: number;
  platformName: string;
  supportEmail: string;
}

interface RevenueData {
  totalRevenue: number;
  artistRevenue: number;
  charityRevenue: number;
  platformRevenue: number;
  ticketsSold: number;
  ordersCompleted: number;
}

interface ArtistRevenueData {
  artistName: string;
  slug: string;
  totalRevenue: number;
  artistRevenue: number;
  charityRevenue: number;
  platformRevenue: number;
  ticketsSold: number;
  ordersCount: number;
  upliftPercentage: number;
  charityName: string;
}

function AdminDashboard() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'artists' | 'simulation'>('dashboard');
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<PlatformSettings>({
    id: '',
    platformFeePercentage: 2.5,
    platformFeeFixed: 1.69,
    allowCustomFees: false,
    minFeePercentage: 1.0,
    maxFeePercentage: 10.0,
    platformName: 'GiveLove',
    supportEmail: 'support@givelove.com'
  });
  const [settingsChanged, setSettingsChanged] = useState(false);

  // Revenue data state
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    artistRevenue: 0,
    charityRevenue: 0,
    platformRevenue: 0,
    ticketsSold: 0,
    ordersCompleted: 0
  });

  const [artistRevenueData, setArtistRevenueData] = useState<ArtistRevenueData[]>([]);

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData();
    loadPlatformSettings();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      // Fetch revenue analytics
      const revenueResponse = await fetch('/api/admin/revenue');

      if (revenueResponse.ok) {
        const revenueResult = await revenueResponse.json();
        if (revenueResult.success) {
          setRevenueData(revenueResult.data.overall);
          setArtistRevenueData(revenueResult.data.byArtist);
        }
      } else {
        // Fallback to mock data if API fails
        console.warn('Failed to fetch revenue data, using mock data');
        setRevenueData({
          totalRevenue: 847650.75,
          artistRevenue: 612400.50,
          charityRevenue: 89850.25,
          platformRevenue: 145400.00,
          ticketsSold: 3847,
          ordersCompleted: 2156
        });

        setArtistRevenueData([
          {
            artistName: 'Taylor Swift',
            slug: 'taylor-swift',
            totalRevenue: 234560.75,
            artistRevenue: 167543.50,
            charityRevenue: 20147.25,
            platformRevenue: 46870.00,
            ticketsSold: 1247,
            ordersCount: 672,
            upliftPercentage: 12.0,
            charityName: 'Education for All'
          },
          {
            artistName: 'Lady Gaga',
            slug: 'lady-gaga',
            totalRevenue: 198750.25,
            artistRevenue: 142875.00,
            charityRevenue: 7137.50,
            platformRevenue: 48737.75,
            ticketsSold: 982,
            ordersCount: 534,
            upliftPercentage: 5.0,
            charityName: 'Mental Health Foundation'
          },
          {
            artistName: 'Garth Brooks',
            slug: 'garth-brooks',
            totalRevenue: 178965.50,
            artistRevenue: 131250.00,
            charityRevenue: 10500.00,
            platformRevenue: 37215.50,
            ticketsSold: 856,
            ordersCount: 487,
            upliftPercentage: 8.0,
            charityName: 'Rural Education Foundation'
          },
          {
            artistName: 'Dolly Parton',
            slug: 'dolly-parton',
            totalRevenue: 235374.25,
            artistRevenue: 170732.00,
            charityRevenue: 25609.75,
            platformRevenue: 39032.50,
            ticketsSold: 762,
            ordersCount: 463,
            upliftPercentage: 15.0,
            charityName: 'Imagination Library'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlatformSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSettings(result.settings);
        }
      }
    } catch (error) {
      console.error('Error loading platform settings:', error);
    }
  };

  const handleSettingsChange = (key: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSettingsChanged(true);
  };

  const saveSettings = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSettings(result.settings);
        setSettingsChanged(false);
        alert('Settings saved successfully!');
      } else {
        alert(`Failed to save settings: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-600" />
              <h1 className="text-2xl font-bold">Platform Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Revenue Dashboard', icon: BarChart3 },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
            { id: 'artists', label: 'Artist Analytics', icon: Users },
            { id: 'simulation', label: 'Ticket Simulation', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Revenue',
                  value: formatCurrency(revenueData.totalRevenue),
                  icon: DollarSign,
                  color: 'text-green-400',
                  bgColor: 'bg-green-400/10 border-green-400/20'
                },
                {
                  title: 'Artist Revenue',
                  value: formatCurrency(revenueData.artistRevenue),
                  icon: Users,
                  color: 'text-blue-400',
                  bgColor: 'bg-blue-400/10 border-blue-400/20'
                },
                {
                  title: 'Charity Revenue',
                  value: formatCurrency(revenueData.charityRevenue),
                  icon: Heart,
                  color: 'text-pink-400',
                  bgColor: 'bg-pink-400/10 border-pink-400/20'
                },
                {
                  title: 'Platform Revenue',
                  value: formatCurrency(revenueData.platformRevenue),
                  icon: Building2,
                  color: 'text-purple-400',
                  bgColor: 'bg-purple-400/10 border-purple-400/20'
                }
              ].map(card => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl border ${card.bgColor}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Volume Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  Tickets Sold
                </h3>
                <p className="text-3xl font-bold text-primary">{formatNumber(revenueData.ticketsSold)}</p>
                <p className="text-gray-400 text-sm mt-2">Total tickets sold across all events</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-500" />
                  Orders Completed
                </h3>
                <p className="text-3xl font-bold text-brand-500">{formatNumber(revenueData.ordersCompleted)}</p>
                <p className="text-gray-400 text-sm mt-2">Total completed transactions</p>
              </motion.div>
            </div>

            {/* Revenue Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Revenue Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Artist Revenue', amount: revenueData.artistRevenue, color: 'bg-blue-500', percentage: (revenueData.artistRevenue / revenueData.totalRevenue * 100) },
                  { label: 'Platform Revenue', amount: revenueData.platformRevenue, color: 'bg-purple-500', percentage: (revenueData.platformRevenue / revenueData.totalRevenue * 100) },
                  { label: 'Charity Revenue', amount: revenueData.charityRevenue, color: 'bg-pink-500', percentage: (revenueData.charityRevenue / revenueData.totalRevenue * 100) }
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{item.label}</span>
                      <div className="text-right">
                        <span className="font-semibold">{formatCurrency(item.amount)}</span>
                        <span className="text-gray-400 text-sm ml-2">({item.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gray-800 rounded-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Platform Fee Settings
                </h3>
                {settingsChanged && (
                  <button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Platform Fee Percentage</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={settings.platformFeePercentage}
                        onChange={(e) => handleSettingsChange('platformFeePercentage', parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Current: {settings.platformFeePercentage}%</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Fixed Platform Fee</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={settings.platformFeeFixed}
                        onChange={(e) => handleSettingsChange('platformFeeFixed', parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-8 text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Current: ${settings.platformFeeFixed}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allowCustomFees"
                      checked={settings.allowCustomFees}
                      onChange={(e) => handleSettingsChange('allowCustomFees', e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="allowCustomFees" className="text-gray-300 font-medium">
                      Allow Custom Fee Ranges
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Platform Name</label>
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleSettingsChange('supportEmail', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  {settings.allowCustomFees && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Minimum Fee %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.minFeePercentage}
                          onChange={(e) => handleSettingsChange('minFeePercentage', parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Maximum Fee %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.maxFeePercentage}
                          onChange={(e) => handleSettingsChange('maxFeePercentage', parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Fee Preview */}
              <div className="mt-8 p-6 bg-gray-700 rounded-lg border-l-4 border-primary">
                <h4 className="text-lg font-medium mb-4">Fee Calculation Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">For $100 ticket:</p>
                    <p className="font-semibold text-primary">
                      ${((100 * settings.platformFeePercentage / 100) + settings.platformFeeFixed).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">For $200 ticket:</p>
                    <p className="font-semibold text-primary">
                      ${((200 * settings.platformFeePercentage / 100) + settings.platformFeeFixed).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">For $300 ticket:</p>
                    <p className="font-semibold text-primary">
                      ${((300 * settings.platformFeePercentage / 100) + settings.platformFeeFixed).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Artist Revenue Analytics
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-4 text-gray-300">Artist</th>
                      <th className="text-right py-4 px-4 text-gray-300">Total Revenue</th>
                      <th className="text-right py-4 px-4 text-gray-300">Artist Share</th>
                      <th className="text-right py-4 px-4 text-gray-300">Charity Share</th>
                      <th className="text-right py-4 px-4 text-gray-300">Platform Share</th>
                      <th className="text-right py-4 px-4 text-gray-300">Tickets</th>
                      <th className="text-right py-4 px-4 text-gray-300">Uplift %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistRevenueData.map(artist => (
                      <tr key={artist.slug} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-white">{artist.artistName}</p>
                            <p className="text-sm text-gray-400">{artist.charityName}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-green-400">
                          {formatCurrency(artist.totalRevenue)}
                        </td>
                        <td className="py-4 px-4 text-right text-blue-400">
                          {formatCurrency(artist.artistRevenue)}
                        </td>
                        <td className="py-4 px-4 text-right text-pink-400">
                          {formatCurrency(artist.charityRevenue)}
                        </td>
                        <td className="py-4 px-4 text-right text-purple-400">
                          {formatCurrency(artist.platformRevenue)}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-300">
                          {formatNumber(artist.ticketsSold)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            {artist.upliftPercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gray-800 rounded-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Ticket Purchase Simulation
              </h3>

              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Control the simulation of ticket purchases across all events. Use this to test how seat availability
                  updates in real-time and demonstrate the platform's functionality.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-300 text-sm">
                    <strong>Note:</strong> Simulated purchases are stored locally and persist across page reloads.
                    Use the reset button to clear all simulated data when demonstrations are complete.
                  </p>
                </div>
              </div>

              <SimulationControls />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminPasswordProtection requiredRole="general">
      <AdminDashboard />
    </AdminPasswordProtection>
  );
}