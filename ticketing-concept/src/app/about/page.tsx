'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ColorPanels } from '@paper-design/shaders-react';
import { Menu, X, ChevronDown, ArrowLeft, Users, Heart, TrendingUp, Shield, Zap, Target } from 'lucide-react';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ticketsDropdownOpen, setTicketsDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ticketsRef.current && !ticketsRef.current.contains(event.target as Node)) {
        setTicketsDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Header with Navigation */}
      <header className="relative z-50 p-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white transition-all duration-300 text-base font-medium group"
          >
            <div className="absolute inset-0 rounded-full bg-white/0 border border-transparent backdrop-blur-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/0 group-hover:shadow-black/10"></div>
            <ArrowLeft className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Back to Home</span>
          </Link>
        </div>

        {/* Desktop Navigation - Individual Glass Buttons */}
        <div className="hidden md:flex justify-center items-center space-x-8">
          {/* Tickets Dropdown */}
          <div className="relative" ref={ticketsRef}>
            <button
              onClick={() => setTicketsDropdownOpen(!ticketsDropdownOpen)}
              className="relative px-6 py-3 rounded-full text-white/90 hover:text-white transition-all duration-300 text-base font-medium group flex items-center gap-2"
            >
              <div className="absolute inset-0 rounded-full bg-white/0 border border-transparent backdrop-blur-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/0 group-hover:shadow-black/10"></div>
              <span className="relative z-10">Tickets</span>
              <ChevronDown className={`relative z-10 w-4 h-4 transition-transform duration-300 ${ticketsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {ticketsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl shadow-black/20 p-4"
                >
                  <div className="space-y-2">
                    <Link
                      href="/event/lady-gaga"
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setTicketsDropdownOpen(false)}
                    >
                      Lady Gaga
                    </Link>
                    <Link
                      href="/event/garth-brooks"
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setTicketsDropdownOpen(false)}
                    >
                      Garth Brooks
                    </Link>
                    <Link
                      href="/event/taylor-swift"
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setTicketsDropdownOpen(false)}
                    >
                      Taylor Swift
                    </Link>
                    <Link
                      href="/event/dolly-parton"
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setTicketsDropdownOpen(false)}
                    >
                      Dolly Parton
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/shop"
            className="relative px-6 py-3 rounded-full text-white/90 hover:text-white transition-all duration-300 text-base font-medium group"
          >
            <div className="absolute inset-0 rounded-full bg-white/0 border border-transparent backdrop-blur-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/0 group-hover:shadow-black/10"></div>
            <span className="relative z-10">Shop</span>
          </Link>

          {/* Admin Dropdown */}
          <div className="relative" ref={adminRef}>
            <button
              onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
              className="relative px-6 py-3 rounded-full text-white/90 hover:text-white transition-all duration-300 text-base font-medium group flex items-center gap-2"
            >
              <div className="absolute inset-0 rounded-full bg-white/0 border border-transparent backdrop-blur-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/0 group-hover:shadow-black/10"></div>
              <span className="relative z-10">Admin</span>
              <ChevronDown className={`relative z-10 w-4 h-4 transition-transform duration-300 ${adminDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {adminDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-56 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl shadow-black/20 p-4"
                >
                  <div className="space-y-2">
                    {/* Artist Portals Section */}
                    <div className="border-b border-white/20 pb-2 mb-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider px-4 py-1 font-medium">Artist Portals</p>
                      <Link
                        href="/artist/lady-gaga"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Lady Gaga
                      </Link>
                      <Link
                        href="/artist/garth-brooks"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Garth Brooks
                      </Link>
                      <Link
                        href="/artist/taylor-swift"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Taylor Swift
                      </Link>
                      <Link
                        href="/artist/dolly-parton"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Dolly Parton
                      </Link>
                    </div>

                    {/* General Admin Section */}
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider px-4 py-1 font-medium">General Admin</p>
                      <Link
                        href="/charity"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Charity Dashboard
                      </Link>
                      <Link
                        href="/pitch"
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Investor Portal
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/10"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Hamburger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                opacity: { duration: 0.2 }
              }}
              className="absolute right-4 top-4 bottom-4 w-80 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Glass panel inner glow */}
              <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              <div className="relative p-8 pt-20 h-full">
                <nav className="space-y-1">
                  <Link
                    href="/event/lady-gaga-kl"
                    className="group block p-4 rounded-2xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Book Tickets</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="/artist"
                    className="group block p-4 rounded-2xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Artist</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="/shop"
                    className="group block p-4 rounded-2xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Shop</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="/charity"
                    className="group block p-4 rounded-2xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Charity</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="/pitch"
                    className="group block p-4 rounded-2xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Investors</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                </nav>

                {/* Bottom accent line */}
                <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layered Background */}
      <div className="fixed inset-0 z-0">
        {/* ColorPanels Base Layer */}
        <ColorPanels
          width="100vw"
          height="100vh"
          colors={["#ff9d00", "#fd4f30", "#809bff", "#6d2eff", "#333aff", "#f15cff", "#ffd557"]}
          colorBack="#000000"
          density={3}
          angle1={0}
          angle2={0}
          length={1.1}
          edges={false}
          blur={0}
          fadeIn={1}
          fadeOut={0.3}
          gradient={0}
          speed={0.5}
          scale={0.8}
        />

        {/* Concert Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Concert.jpg)',
            opacity: 0.2,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Darker gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Our Story
              </h1>
              <p className="text-xl md:text-2xl font-light text-white/85 leading-relaxed max-w-4xl mx-auto">
                How we're revolutionizing the entertainment industry to serve everyone while making a positive social impact
              </p>
            </motion.div>

            {/* The Problem Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-20"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                    <Shield className="w-10 h-10 text-red-400" />
                    The Problem We Saw
                  </h2>
                  <div className="space-y-4 text-lg text-white/90 leading-relaxed">
                    <p>
                      We watched as scalpers and secondary markets transformed live entertainment from an accessible joy into an exclusive luxury. Families were priced out of concerts. Fans missed their favorite artists because bots bought tickets faster than humans ever could.
                    </p>
                    <p>
                      The industry had lost its way. What was once about bringing communities together through music had become about maximizing profit at any cost. Something had to change.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-3xl p-8 border border-red-500/20">
                    <img
                      src="/Concert.jpg"
                      alt="Empty concert venue showing the problem"
                      className="w-full h-64 object-cover rounded-2xl mb-6 opacity-80"
                    />
                    <div className="text-center">
                      <h3 className="text-white font-bold text-xl mb-2">The Old Way</h3>
                      <p className="text-red-300 text-sm">Scalpers, inflated prices, excluded communities</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Our Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-20"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 border border-blue-500/20">
                    <img
                      src="/ladygaga.jpg"
                      alt="Diverse crowd enjoying live music"
                      className="w-full h-64 object-cover rounded-2xl mb-6"
                    />
                    <div className="text-center">
                      <h3 className="text-white font-bold text-xl mb-2">The New Way</h3>
                      <p className="text-blue-300 text-sm">Fair access, community impact, shared prosperity</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                    <Heart className="w-10 h-10 text-brand-400" />
                    Back to Our Roots
                  </h2>
                  <div className="space-y-4 text-lg text-white/90 leading-relaxed">
                    <p>
                      We remembered when entertainment served everyone at all economic levels. When a concert ticket was an investment in joy, not a luxury commodity. When music brought people together instead of dividing them by wealth.
                    </p>
                    <p>
                      That's the industry we're rebuilding – one where fair treatment isn't just an ideal, but a business model. Where every ticket sold makes the world a little bit better.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Innovation Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center justify-center gap-3">
                  <Zap className="w-10 h-10 text-yellow-400" />
                  Our Innovation
                </h2>
                <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                  We didn't just want to fix the problem – we wanted to turn it into an opportunity for positive change.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Fair Pricing */}
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/20">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">Fair Access</h3>
                  <p className="text-green-200/80 leading-relaxed">
                    We eliminated scalping by creating a system where last-minute demand helps charities instead of enriching middlemen.
                  </p>
                </div>

                {/* Community Impact */}
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">Social Impact</h3>
                  <p className="text-purple-200/80 leading-relaxed">
                    Every ticket purchase directly funds charitable causes, turning entertainment into a force for positive change.
                  </p>
                </div>

                {/* Artist Partnership */}
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/20">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">Artist Empowerment</h3>
                  <p className="text-blue-200/80 leading-relaxed">
                    Artists choose which causes to support, creating authentic partnerships between entertainment and social good.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Impact Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-20"
            >
              <div className="bg-gradient-to-r from-brand-400/20 to-purple-600/20 rounded-3xl p-8 md:p-12 border border-brand-400/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-tight">
                  Our Impact So Far
                </h2>

                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-brand-400 mb-2">$2.1M</div>
                    <div className="text-white/80 font-medium">Raised for Charity</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">45K</div>
                    <div className="text-white/80 font-medium">Families Helped</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">127</div>
                    <div className="text-white/80 font-medium">Artist Partnerships</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">500K</div>
                    <div className="text-white/80 font-medium">Tickets Sold Fairly</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision for the Future */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center justify-center gap-3">
                  <Target className="w-10 h-10 text-brand-400" />
                  Our Vision for the Future
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Industry Transformation</h3>
                  <div className="space-y-4 text-lg text-white/90 leading-relaxed">
                    <p>
                      We envision an entertainment industry where every event contributes to social good. Where fans feel proud not just of the shows they attend, but of the positive impact they create.
                    </p>
                    <p>
                      We're building partnerships with venues, artists, and charitable organizations worldwide to make this vision a reality.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Global Scale</h3>
                  <div className="space-y-4 text-lg text-white/90 leading-relaxed">
                    <p>
                      Our goal is to become the standard for how entertainment commerce works – fair, accessible, and impactful. Every genre, every venue size, every community.
                    </p>
                    <p>
                      Together, we can prove that doing good and doing well aren't mutually exclusive. They're complementary forces that create a better world for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-3xl p-8 md:p-12 border border-purple-500/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                  Join Our Movement
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Every ticket you buy, every event you attend, every moment of joy you experience –
                  it all contributes to a better world. This is entertainment with purpose.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Explore Events
                  </Link>
                  <Link
                    href="/charity"
                    className="bg-transparent border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl transition-all font-medium"
                  >
                    See Our Impact
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8">
          <p className="text-white/50 text-sm">
            © 2025 Give Back Ticketing Platform • Building a Better Entertainment Industry
          </p>
        </footer>
      </div>
    </div>
  );
}