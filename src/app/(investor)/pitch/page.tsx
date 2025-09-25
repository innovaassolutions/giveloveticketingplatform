'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Unlock, TrendingUp, DollarSign, Users, Globe, Heart, Target, BarChart3, PieChart, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Password protection
const INVESTOR_PASSWORD = 'giveback2025'; // Change this to your preferred password

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function InvestorPitch() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginError, setLoginError] = useState('');

  // Revenue Model Data - Updated from Pitch Deck MD
  const revenueModel = {
    platformFee: 2.5, // % + $1.69 per ticket
    fixedFee: 1.69, // $ per transaction
    averageTicketPrice: 120, // Face value (Lady Gaga example)
    marketPrice: 300, // Market-driven price (Lady Gaga resale average)
    charitableUplift: 180, // Price differential (150% uplift)
    ticketsPerEvent: 1500, // From projections
    eventsPerMonth: 167, // 2000 events annually / 12 months
    charityUpliftAverage: 150, // Average uplift % seen in market
    yearOneRevenue: 571000, // Year 1 projection from MD
    yearThreeRevenue: 17200000, // Year 3 projection from MD
    yearFiveRevenue: 82400000, // Year 5 projection from MD
    breakEvenTransactions: 30000, // Annual transactions for break-even
    totalMarketSize: 35000000000, // $30-40B secondary market from MD
    samMarketSize: 10000000000, // $10B SAM from MD
    npvFiveYear: 161600000, // $161.6M NPV from MD
    marketGrowthRate: 8.1, // % annual growth
    fanUpliftAverage: 296 // Average fans pay 296% above face value
  };

  const marketData = [
    { year: 'Year 1', revenue: 0.571, charity: 0.428, events: 5, artists: 5, tickets: 50 }, // 5 artists, 50K tickets
    { year: 'Year 2', revenue: 3.1, charity: 2.325, events: 15, artists: 15, tickets: 270 }, // 15 artists, 270K tickets
    { year: 'Year 3', revenue: 17.2, charity: 12.9, events: 50, artists: 50, tickets: 1500 }, // 50 artists, 1.5M tickets
    { year: 'Year 4', revenue: 41.2, charity: 30.9, events: 80, artists: 80, tickets: 3600 }, // 80 artists, 3.6M tickets
    { year: 'Year 5', revenue: 82.4, charity: 61.8, events: 120, artists: 120, tickets: 7200 } // 120 artists, 7.2M tickets
  ];

  const competitorData = [
    { name: 'Ticketmaster', marketShare: 70, fees: '10-20%', charity: '0%' },
    { name: 'StubHub', marketShare: 15, fees: '10-15%', charity: '0%' },
    { name: 'Eventbrite', marketShare: 8, fees: '3.5-7%', charity: '0%' },
    { name: 'SeatGeek', marketShare: 4, fees: '10-15%', charity: '0%' },
    { name: 'Give Back', marketShare: 0, fees: '2.5% + $1.69', charity: '0-25%' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === INVESTOR_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const slides: Slide[] = [
    {
      id: 1,
      title: "Charitable Dynamic Ticketing Platform",
      subtitle: "Turning scalping into social good",
      content: (
        <div className="text-center space-y-8">
          {/* Hero Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
            <img
              src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=400&fit=crop&crop=center"
              alt="Concert crowd with hands raised"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-brand-500/80 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Imagine every scalped ticket funding global good</h3>
                <p className="text-white/90 text-xl max-w-2xl">
                  Fans pay on average {revenueModel.fanUpliftAverage}% above face value. Let's redirect that to charities.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center bg-blue-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-primary">${(revenueModel.npvFiveYear / 1000000).toFixed(0)}M</div>
              <div className="text-gray-700 text-lg">5-Year NPV</div>
              <div className="text-gray-500">Financial Impact</div>
            </div>
            <div className="text-center bg-green-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-green-600">${(revenueModel.totalMarketSize / 1000000000).toFixed(0)}B+</div>
              <div className="text-gray-700 text-lg">Market Size</div>
              <div className="text-gray-500">Secondary Tickets</div>
            </div>
            <div className="text-center bg-purple-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-purple-600">{revenueModel.fanUpliftAverage}%</div>
              <div className="text-gray-700 text-lg">Average Uplift</div>
              <div className="text-gray-500">Fan Premium</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">The Opportunity</h3>
            <p className="text-xl text-white/90 mb-4">
              Billions of dollars flow from fans to scalpers every year. We capture this at source and redirect it to social impact.
            </p>
            <div className="text-lg font-semibold">
              Strong financial returns + Unparalleled social impact
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Investment Opportunity",
      subtitle: "Strong Financial Returns + Unparalleled Social Impact",
      content: (
        <div className="space-y-6">
          {/* Hero Investment Visual - Reduced height */}
          <div className="relative h-32 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=200&fit=crop&crop=center"
              alt="Investment and growth"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-600/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-1">Join the Social Impact Revolution</h3>
                <p className="text-lg">Help us redirect billions from scalpers to global good</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl text-white text-center shadow-lg">
              <img src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=60&h=60&fit=crop&crop=center"
                   alt="funding" className="w-12 h-12 mx-auto mb-3 rounded-full opacity-80" />
              <h3 className="text-lg font-bold mb-1">Seeking</h3>
              <div className="text-3xl font-bold mb-1">$X Million</div>
              <div className="text-blue-100">Seed/Series A</div>
              <div className="text-blue-200 text-xs mt-1">Scale technology & compliance</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white text-center shadow-lg">
              <img src="https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=60&h=60&fit=crop&crop=center"
                   alt="returns" className="w-12 h-12 mx-auto mb-3 rounded-full opacity-80" />
              <h3 className="text-lg font-bold mb-1">NPV Potential</h3>
              <div className="text-3xl font-bold mb-1">${(revenueModel.npvFiveYear / 1000000).toFixed(0)}M+</div>
              <div className="text-green-100">5-Year NPV</div>
              <div className="text-green-200 text-xs mt-1">4% discount rate</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white text-center shadow-lg">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=60&h=60&fit=crop&crop=center"
                   alt="impact" className="w-12 h-12 mx-auto mb-3 rounded-full opacity-80" />
              <h3 className="text-lg font-bold mb-1">Social Impact</h3>
              <div className="text-3xl font-bold mb-1">$60M+</div>
              <div className="text-purple-100">Annual Charity Flow</div>
              <div className="text-purple-200 text-xs mt-1">Year 5 projection</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=40&h=40&fit=crop&crop=center"
                     alt="funds" className="w-6 h-6 rounded-full" />
                Use of Funds
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Development & Technology</span>
                  <span className="font-bold text-blue-600">40%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Compliance & Legal Frameworks</span>
                  <span className="font-bold text-red-600">35%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Marketing & Artist Onboarding</span>
                  <span className="font-bold text-green-600">15%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Operations & Infrastructure</span>
                  <span className="font-bold text-purple-600">10%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                Focus: US/EU/SEA/Middle East expansion and regulatory compliance
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=40&h=40&fit=crop&crop=center"
                     alt="milestones" className="w-6 h-6 rounded-full" />
                Go-to-Market Strategy
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-gray-800 font-semibold text-sm">Artist-First Approach</span>
                    <p className="text-gray-600 text-xs mt-0.5">Leverage relationships with high-profile stars (e.g., Lady Gaga)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-gray-800 font-semibold text-sm">Flagship Tours Launch</span>
                    <p className="text-gray-600 text-xs mt-0.5">Media coverage → fan adoption → viral growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-gray-800 font-semibold text-sm">Global Expansion</span>
                    <p className="text-gray-600 text-xs mt-0.5">Venues, festivals, and regional markets worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-gray-800 font-semibold text-sm">Regulatory Partnerships</span>
                    <p className="text-gray-600 text-xs mt-0.5">Charities and regulators ensure compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Vision - More compact */}
          <div className="bg-gradient-to-r from-primary to-brand-500 p-6 rounded-xl text-white text-center">
            <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&h=80&fit=crop&crop=center"
                 alt="vision" className="w-16 h-16 mx-auto mb-4 rounded-full opacity-80" />
            <h3 className="text-2xl font-bold mb-3">Vision Statement</h3>
            <p className="text-lg mb-4 font-light italic">
              "Imagine every scalped ticket funding schools, feeding families, and supporting communities worldwide."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-lg font-bold">Default Platform</div>
                <div className="text-white/80 text-sm">Fair ticketing worldwide</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-lg font-bold">Billions Redirected</div>
                <div className="text-white/80 text-sm">From scalpers to charities</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-lg font-bold">Global Impact</div>
                <div className="text-white/80 text-sm">Every ticket counts</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "The Problem",
      subtitle: "Billions lost to scalpers while charities receive nothing",
      content: (
        <div className="space-y-8">
          {/* Problem Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop&crop=center"
                alt="Frustrated fan looking at expensive tickets"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                <div className="bg-white/90 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600">{revenueModel.fanUpliftAverage}%</div>
                  <div className="text-sm text-gray-700">Average fan overpay</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&crop=center"
                alt="Children in need - charity recipients"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                <div className="bg-white/90 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">$0</div>
                  <div className="text-sm text-gray-700">To charities today</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=40&h=40&fit=crop&crop=center"
                     alt="broken" className="w-8 h-8 rounded-full" />
                Current Industry Issues
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Unfair resale prices:</span>
                    <p className="text-gray-600">Fans face 3-4× face value prices on average</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Artists lose goodwill:</span>
                    <p className="text-gray-600">Fans blame artists for high resale prices</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Billions to scalpers:</span>
                    <p className="text-gray-600">Charities receive nothing from the $30B+ secondary market</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-500 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=40&h=40&fit=crop&crop=center"
                     alt="solution" className="w-8 h-8 rounded-full" />
                Our Solution
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Capture uplift at source:</span>
                    <p className="text-gray-600">Ticket sold → uplift captured → charity + platform fee</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Artist-chosen charities:</span>
                    <p className="text-gray-600">Redirect surplus to causes artists care about</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <span className="text-gray-800 font-semibold">Fan tax benefits:</span>
                    <p className="text-gray-600">Fans receive tax receipts and social status as contributors</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Market Opportunity",
      subtitle: "Global Secondary Ticket Market: $30-40B+ Annual Revenue",
      content: (
        <div className="space-y-8">
          {/* Market Hero Image */}
          <div className="relative h-48 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=300&fit=crop&crop=center"
              alt="Global concert venues and stages"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-2">Massive Global Opportunity</h3>
                <p className="text-xl">Even 1% market adoption yields $100M+ in platform revenue</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <img src="https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=60&h=60&fit=crop&crop=center"
                   alt="global" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover" />
              <div className="text-3xl font-bold text-blue-600">${(revenueModel.totalMarketSize / 1000000000).toFixed(0)}B+</div>
              <div className="text-sm text-gray-700 font-medium">Total Addressable Market</div>
              <div className="text-xs text-gray-500">Secondary ticket sales</div>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <img src="https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=60&h=60&fit=crop&crop=center"
                   alt="target" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover" />
              <div className="text-3xl font-bold text-green-600">${(revenueModel.samMarketSize / 1000000000).toFixed(0)}B</div>
              <div className="text-sm text-gray-700 font-medium">Serviceable Available Market</div>
              <div className="text-xs text-gray-500">High-demand tours &gt;100% uplift</div>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=60&h=60&fit=crop&crop=center"
                   alt="growth" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover" />
              <div className="text-3xl font-bold text-purple-600">{revenueModel.marketGrowthRate}%</div>
              <div className="text-sm text-gray-700 font-medium">Annual Growth Rate</div>
              <div className="text-xs text-gray-500">Accelerating digitalization</div>
            </div>
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=center"
                   alt="opportunity" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover" />
              <div className="text-3xl font-bold text-orange-600">1%</div>
              <div className="text-sm text-gray-700 font-medium">Market Share Target</div>
              <div className="text-xs text-gray-500">$100M+ revenue potential</div>
            </div>
          </div>

          {/* Market Example */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Real Market Example</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Lady Gaga Chromatica Ball Tour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Face Value:</span>
                    <span className="font-bold text-gray-800">${revenueModel.averageTicketPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resale Average:</span>
                    <span className="font-bold text-indigo-600">${revenueModel.marketPrice}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-700 font-semibold">Uplift Captured:</span>
                    <span className="font-bold text-green-600">${revenueModel.charitableUplift} (150%)</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center"
                  alt="Concert performance with crowd"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="h-80">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">5-Year Revenue Growth Projection</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value}M` : name === 'charity' ? `$${value}M` : `${value} ${name}`,
                  name === 'revenue' ? 'Platform Revenue' : name === 'charity' ? 'Charity Impact' :
                  name === 'artists' ? 'Artists' : 'Tickets (K)'
                ]} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#026cdf" fill="#026cdf" fillOpacity={0.7} />
                <Area type="monotone" dataKey="charity" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Revenue Model",
      subtitle: "2.5% + $1.69 Platform Fee + Dynamic Charity Uplift",
      content: (
        <div className="space-y-8">
          {/* Large Revenue Model Example Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Transaction Revenue Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Face Value</div>
                <div className="text-2xl font-bold text-gray-800">${revenueModel.averageTicketPrice}</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Market Price</div>
                <div className="text-2xl font-bold text-blue-600">${revenueModel.marketPrice}</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Platform Fee</div>
                <div className="text-2xl font-bold text-green-600">${(revenueModel.marketPrice * revenueModel.platformFee / 100 + revenueModel.fixedFee).toFixed(2)}</div>
                <div className="text-xs text-gray-500">({revenueModel.platformFee}% + ${revenueModel.fixedFee})</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Charity Impact</div>
                <div className="text-2xl font-bold text-purple-600">${revenueModel.charitableUplift}</div>
              </div>
            </div>
          </div>

          {/* Two-column layout for better white space utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Fee Structure Comparison</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Ticketmaster:</span>
                    <span className="font-bold text-red-600 text-lg">10-20%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">StubHub:</span>
                    <span className="font-bold text-red-600 text-lg">10-15%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Eventbrite:</span>
                    <span className="font-bold text-orange-600 text-lg">3.5-7%</span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 pt-4 mt-4">
                    <span className="text-gray-800 font-semibold text-lg">Give Back:</span>
                    <span className="font-bold text-green-600 text-lg">{revenueModel.platformFee}% + ${revenueModel.fixedFee}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Key Business Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Market Growth Rate:</span>
                    <span className="font-bold text-blue-600 text-lg">{revenueModel.marketGrowthRate}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Break-even Volume:</span>
                    <span className="font-bold text-blue-600 text-lg">{(revenueModel.breakEvenTransactions / 1000).toFixed(0)}K tickets</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Total Market Size:</span>
                    <span className="font-bold text-blue-600 text-lg">${revenueModel.totalMarketSize / 1000000000}B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-green-50 p-8 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Projections</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Year 1 Revenue:</span>
                    <span className="font-bold text-green-600 text-lg">${(revenueModel.yearOneRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Year 3 Revenue:</span>
                    <span className="font-bold text-green-600 text-lg">${(revenueModel.yearThreeRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 text-lg">Conservative Estimate:</span>
                    <span className="font-bold text-green-600 text-lg">30% below projections</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl border border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Competitive Advantage</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700 text-lg">Lowest fees in industry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700 text-lg">Built-in charity integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700 text-lg">Real-time impact tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700 text-lg">Artist-controlled uplift</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Financial Table from MD */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">5-Year Financial Projections</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="border p-4 text-left font-semibold text-gray-800">Year</th>
                    <th className="border p-4 text-left font-semibold text-gray-800">Artists</th>
                    <th className="border p-4 text-left font-semibold text-gray-800">Tickets</th>
                    <th className="border p-4 text-left font-semibold text-gray-800">Platform Revenue</th>
                    <th className="border p-4 text-left font-semibold text-gray-800">Charity Impact</th>
                    <th className="border p-4 text-left font-semibold text-gray-800">Net Cash Flow</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-4 font-semibold text-gray-800">1</td>
                    <td className="border p-4 text-gray-700">5</td>
                    <td className="border p-4 text-gray-700">50K</td>
                    <td className="border p-4 font-semibold text-green-600">$571K</td>
                    <td className="border p-4 text-purple-600">$428K</td>
                    <td className="border p-4 text-red-600">-$178K</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-4 font-semibold text-gray-800">2</td>
                    <td className="border p-4 text-gray-700">15</td>
                    <td className="border p-4 text-gray-700">270K</td>
                    <td className="border p-4 font-semibold text-green-600">$3.1M</td>
                    <td className="border p-4 text-purple-600">$2.3M</td>
                    <td className="border p-4 text-green-600">$1.3M</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-blue-50">
                    <td className="border p-4 font-semibold text-gray-800">3</td>
                    <td className="border p-4 text-gray-700">50</td>
                    <td className="border p-4 text-gray-700">1.5M</td>
                    <td className="border p-4 font-semibold text-green-600">$17.2M</td>
                    <td className="border p-4 text-purple-600">$12.9M</td>
                    <td className="border p-4 text-green-600 font-bold">$13.2M</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-4 font-semibold text-gray-800">4</td>
                    <td className="border p-4 text-gray-700">80</td>
                    <td className="border p-4 text-gray-700">3.6M</td>
                    <td className="border p-4 font-semibold text-green-600">$41.2M</td>
                    <td className="border p-4 text-purple-600">$30.9M</td>
                    <td className="border p-4 text-green-600 font-bold">$31.2M</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="border p-4 font-semibold text-gray-800">5</td>
                    <td className="border p-4 text-gray-700">120</td>
                    <td className="border p-4 text-gray-700">7.2M</td>
                    <td className="border p-4 font-semibold text-green-600">$82.4M</td>
                    <td className="border p-4 text-purple-600">$61.8M</td>
                    <td className="border p-4 text-green-600 font-bold">$62.4M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center space-y-2">
              <div className="text-lg font-semibold text-gray-800">
                NPV (4% discount): <span className="text-green-600">${(revenueModel.npvFiveYear / 1000000).toFixed(1)}M</span>
              </div>
              <div className="text-gray-600">Break-even: Year 2-3</div>
              <div className="text-sm text-gray-500">Faster artist adoption could double these figures</div>
            </div>
          </div>

          {/* Enhanced Visual Financial Summary */}
          <div className="bg-gradient-to-r from-primary to-brand-500 p-10 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">Key Financial Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=60&h=60&fit=crop&crop=center"
                     alt="revenue" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover opacity-80" />
                <div className="text-3xl font-bold mb-2">${(revenueModel.yearFiveRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-white/80 text-lg">Year 5 Revenue</div>
                <div className="text-white/60 text-sm mt-2">Annual Platform Revenue</div>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=60&h=60&fit=crop&crop=center"
                     alt="charity" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover opacity-80" />
                <div className="text-3xl font-bold mb-2">$61.8M</div>
                <div className="text-white/80 text-lg">Charity Impact</div>
                <div className="text-white/60 text-sm mt-2">Year 5 Social Good</div>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=60&h=60&fit=crop&crop=center"
                     alt="npv" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover opacity-80" />
                <div className="text-3xl font-bold mb-2">${(revenueModel.npvFiveYear / 1000000).toFixed(0)}M</div>
                <div className="text-white/80 text-lg">5-Year NPV</div>
                <div className="text-white/60 text-sm mt-2">4% Discount Rate</div>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=60&h=60&fit=crop&crop=center"
                     alt="growth" className="w-12 h-12 mx-auto mb-3 rounded-full object-cover opacity-80" />
                <div className="text-3xl font-bold mb-2">2-3</div>
                <div className="text-white/80 text-lg">Break-even</div>
                <div className="text-white/60 text-sm mt-2">Years to Profitability</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="text-xl font-semibold mb-2">Strong Returns + Massive Social Impact</div>
              <div className="text-lg opacity-90">Hundreds of millions redirected from scalpers to global good</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Competitive Advantage",
      subtitle: "First-Mover in Charitable Event Ticketing",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left text-gray-800 font-semibold">Platform</th>
                  <th className="border p-3 text-left text-gray-800 font-semibold">Market Share</th>
                  <th className="border p-3 text-left text-gray-800 font-semibold">Total Fees</th>
                  <th className="border p-3 text-left text-gray-800 font-semibold">Charity Integration</th>
                  <th className="border p-3 text-left text-gray-800 font-semibold">Transparency</th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map((comp, i) => (
                  <tr key={i} className={comp.name === 'Give Back' ? 'bg-green-50' : ''}>
                    <td className="border p-3 font-semibold text-gray-800">{comp.name}</td>
                    <td className="border p-3 text-gray-700">{comp.marketShare}%</td>
                    <td className="border p-3 text-gray-700">{comp.fees}</td>
                    <td className="border p-3 text-gray-700">{comp.charity}</td>
                    <td className="border p-3 text-gray-700">
                      {comp.name === 'Give Back' ? '✅ Full' : '❌ Limited'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Unique Value Proposition</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">First platform with built-in charity giving</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Artist-controlled revenue split (0-25% to charity)</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Lower fees than all major competitors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Real-time impact tracking and transparency</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Technology Differentiators</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Modern Next.js 15 + TypeScript architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Real-time seating map with WebSocket updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Interactive charity uplift controls for artists</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Comprehensive impact dashboards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Investor Access</h1>
            <p className="text-gray-600">Enter password to view pitch presentation</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter investor password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {loginError && (
              <div className="text-red-500 text-sm text-center">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Unlock className="w-5 h-5 inline mr-2" />
              Access Pitch Deck
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For investor inquiries, contact:</p>
            <p className="font-medium">investors@givebacktickets.com</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-brand-500 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Give Back Ticketing - Investor Presentation</h1>
          <div className="text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>
      </header>

      {/* Slide Content */}
      <main className="max-w-7xl mx-auto p-8 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px] pb-8"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {slides[currentSlide].title}
              </h1>
              {slides[currentSlide].subtitle && (
                <p className="text-xl text-gray-600">
                  {slides[currentSlide].subtitle}
                </p>
              )}
            </div>

            <div className="w-full">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentSlide === slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(0)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Start
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}