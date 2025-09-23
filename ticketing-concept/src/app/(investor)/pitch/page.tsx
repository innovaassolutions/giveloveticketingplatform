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

  // Revenue Model Data - From Business Analysis Report
  const revenueModel = {
    platformFee: 2.5, // % + $1.69 per ticket (simplified to 2.5% for display)
    fixedFee: 1.69, // $ per transaction
    averageTicketPrice: 100, // Face value from business analysis
    marketPrice: 300, // Market-driven price from analysis
    charitableUplift: 200, // Price differential
    ticketsPerEvent: 1500, // From year 3 projections
    eventsPerMonth: 167, // 2000 events annually / 12 months
    charityUpliftAverage: 25, // Max % allowed for charity
    yearOneRevenue: 247000, // Conservative first year from analysis
    yearThreeRevenue: 9840000, // Growth scenario from analysis
    breakEvenTransactions: 30000, // Annual transactions for break-even
    totalMarketSize: 67000000000, // $67B global market
    marketGrowthRate: 8.1 // % annual growth
  };

  const marketData = [
    { year: 'Year 1', revenue: 0.247, charity: 0.185, events: 50 }, // From business analysis conservative
    { year: 'Year 2', revenue: 2.5, charity: 1.9, events: 250 }, // Scaling projection
    { year: 'Year 3', revenue: 9.84, charity: 7.4, events: 1000 }, // Growth scenario from analysis
    { year: 'Year 4', revenue: 25, charity: 18.8, events: 2500 }, // Continued growth
    { year: 'Year 5', revenue: 50, charity: 37.5, events: 5000 } // Market maturity
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
      title: "Give Back Ticketing Platform",
      subtitle: "Revolutionizing Event Ticketing Through Transparency & Social Impact",
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary to-brand-500 p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Fair Tickets. Real Impact.</h3>
            <p className="text-white/90 text-lg">
              The first ticketing platform where every sale supports charitable causes
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">${(revenueModel.yearThreeRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-gray-600">Year 3 Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-500">{revenueModel.platformFee}%</div>
              <div className="text-gray-600">Platform Fee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">0-{revenueModel.charityUpliftAverage}%</div>
              <div className="text-gray-600">Charity Uplift</div>
            </div>
          </div>

        </div>
      )
    },
    {
      id: 2,
      title: "The Problem",
      subtitle: "Event Ticketing is Broken",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-500">Current Industry Issues</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Excessive Fees:</strong> 10-20% total fees vs our 2.5% + $1.69</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Zero Social Impact:</strong> No charitable integration despite artist interest</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Venue Exclusivity:</strong> Ticketmaster exclusive contracts limit competition</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Scalping Problems:</strong> Artists lose revenue to secondary market</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-500">Our Solution</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Lower Fees:</strong> 2.5% + $1.69 vs 10-20% competitors</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Dynamic Charity Pricing:</strong> Capture scalper profits for good</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Tax Benefits:</strong> Fans get deductible charitable receipts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Industry Relationships:</strong> Leveraging key venue connections</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Market Opportunity",
      subtitle: "Global Event Ticketing Market: $67B+ and Growing",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$67B</div>
              <div className="text-sm text-gray-600">Global Market Size</div>
            </div>
            <div className="text-center bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8.1%</div>
              <div className="text-sm text-gray-600">Annual Growth Rate</div>
            </div>
            <div className="text-center bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.8B</div>
              <div className="text-sm text-gray-600">Tickets Sold Annually</div>
            </div>
            <div className="text-center bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">70%</div>
              <div className="text-sm text-gray-600">Digital Penetration</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value}M` : name === 'charity' ? `$${value}M` : value,
                  name === 'revenue' ? 'Platform Revenue' : name === 'charity' ? 'Charity Impact' : 'Events'
                ]} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#026cdf" fill="#026cdf" fillOpacity={0.6} />
                <Area type="monotone" dataKey="charity" stackId="1" stroke="#33b8aa" fill="#33b8aa" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      id: 4,
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

          {/* Enhanced Financial Projection Section */}
          <div className="bg-gradient-to-r from-primary to-brand-500 p-10 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">Financial Growth Trajectory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">${(revenueModel.yearOneRevenue / 1000).toFixed(0)}K</div>
                <div className="text-white/80 text-lg">Year 1 Revenue</div>
                <div className="text-white/60 text-sm mt-2">Conservative Estimate</div>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">${(revenueModel.yearThreeRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-white/80 text-lg">Year 3 Revenue</div>
                <div className="text-white/60 text-sm mt-2">Growth Scenario</div>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">${(revenueModel.totalMarketSize / 1000000000)}B</div>
                <div className="text-white/80 text-lg">Total Market</div>
                <div className="text-white/60 text-sm mt-2">Global Opportunity</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="text-lg opacity-90">Break-even at {(revenueModel.breakEvenTransactions / 1000).toFixed(0)}K annual tickets</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
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
    },
    {
      id: 6,
      title: "Investment Opportunity",
      subtitle: "Join Us in Revolutionizing Event Ticketing",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Seeking</h3>
              <div className="text-3xl font-bold">$750K</div>
              <div className="text-blue-100">Development Phase</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Break-even</h3>
              <div className="text-3xl font-bold">30K</div>
              <div className="text-green-100">Annual Tickets</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Market Size</h3>
              <div className="text-3xl font-bold">$67B</div>
              <div className="text-purple-100">Global Opportunity</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Use of Funds</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Core Platform Development</span>
                  <span className="font-bold text-gray-800">40% ($300K)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Charity Integration</span>
                  <span className="font-bold text-gray-800">13% ($100K)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Compliance & Legal</span>
                  <span className="font-bold text-gray-800">40% ($300K)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Operations & Marketing</span>
                  <span className="font-bold text-gray-800">7% ($50K)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Key Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Phase 1 (4-6 weeks):</strong> Market validation & industry interviews</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Phase 2 (8-12 weeks):</strong> Technical proof of concept & charity integration</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Phase 3 (6 months):</strong> Pilot with 2-3 independent venues</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Year 2:</strong> Scale to 50 venues, reach break-even volume</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-brand-500 p-8 rounded-xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Event Ticketing?</h3>
            <p className="text-lg mb-6">
              Join us in building the future of fair, transparent, and impactful event ticketing.
            </p>
            <div className="text-3xl font-bold">Let's Make Every Ticket Count 🎵</div>
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
      <main className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[600px]"
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