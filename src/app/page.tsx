'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ColorPanels } from '@paper-design/shaders-react';
import { Menu, X, ChevronDown, Apple, Droplets, BookOpen, Home as HomeIcon, Mic } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ticketsDropdownOpen, setTicketsDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const artistCardsRef = useRef<HTMLDivElement>(null);

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

  // Scroll to artist cards function
  const scrollToArtistCards = () => {
    if (artistCardsRef.current) {
      artistCardsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };
  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Header with Navigation */}
      <header className="relative z-50 p-6">
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
            opacity: 0.3,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Darker gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center px-8 md:px-16 lg:px-24">
          <div className="text-center max-w-5xl">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold text-white leading-tight tracking-tight">
                MUSIC = LOVE
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-16"
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/85 leading-relaxed tracking-wide max-w-4xl mx-auto">
                Where artists and their fans come together to make positive change in the world.
              </p>
            </motion.div>

            {/* Three Column Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto"
            >
              {/* Fans Column */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
                  Fans
                </h3>
                <p className="text-lg md:text-xl font-light text-white/80 leading-relaxed">
                  Late decisions to buy last minute tickets
                </p>
              </div>

              {/* Second Market Column */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
                  Second Market
                </h3>
                <p className="text-lg md:text-xl font-light text-white/80 leading-relaxed">
                  Fills demand with face value uplift
                </p>
              </div>

              {/* Charity Column */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
                  Uplift
                </h3>
                <p className="text-lg md:text-xl font-light text-white/80 leading-relaxed">
                  Goes to charities to help those in need
                </p>
              </div>
            </motion.div>

            {/* Impact Question */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-16"
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed tracking-wide max-w-5xl mx-auto text-center italic">
                What if the difference between demand and uplift was all it took to change someone's life?
              </p>
            </motion.div>

            {/* Artist Cards */}
            <motion.div
              ref={artistCardsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="mt-20"
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-12 text-center tracking-tight">
                Featured Artists
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                {/* Lady Gaga */}
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/20">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src="/ladygaga.jpg"
                        alt="Lady Gaga"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white text-center tracking-tight mb-2">
                        Lady Gaga
                      </h4>
                      <div className="flex justify-center mb-3">
                        <p className="text-xs text-white/80 text-center font-medium">
                          Born This Way Foundation
                        </p>
                      </div>
                      <div>
                        <Link href="/event/lady-gaga" className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                          Buy Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garth Brooks */}
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/20">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src="/GarthBrooks.jpg"
                        alt="Garth Brooks"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white text-center tracking-tight mb-2">
                        Garth Brooks
                      </h4>
                      <div className="flex justify-center mb-3">
                        <p className="text-xs text-white/80 text-center font-medium">
                          Teammates for Kids Foundation
                        </p>
                      </div>
                      <div>
                        <Link href="/event/garth-brooks" className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                          Buy Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taylor Swift */}
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/20">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src="/TaylorSwift.webp"
                        alt="Taylor Swift"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white text-center tracking-tight mb-2">
                        Taylor Swift
                      </h4>
                      <div className="flex justify-center mb-3">
                        <p className="text-xs text-white/80 text-center font-medium">
                          Joyful Heart Foundation
                        </p>
                      </div>
                      <div>
                        <Link href="/event/taylor-swift" className="block w-full text-center bg-pink-600 hover:bg-pink-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                          Buy Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dolly Parton */}
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/20">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src="/DollyParton.webp"
                        alt="Dolly Parton"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white text-center tracking-tight mb-2">
                        Dolly Parton
                      </h4>
                      <div className="flex justify-center mb-3">
                        <p className="text-xs text-white/80 text-center font-medium">
                          Dollywood Foundation
                        </p>
                      </div>
                      <div>
                        <Link href="/event/dolly-parton" className="block w-full text-center bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                          Buy Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Impact Storytelling Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="mt-24"
            >
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
                    See the Difference Your Ticket Makes
                  </h2>
                  <p className="text-lg md:text-xl font-light text-white/80 leading-relaxed">
                    Every ticket you buy creates real impact in communities around the world
                  </p>
                </div>

                {/* Visual Breakdown */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 mb-16 border border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Where Your Money Goes</h3>

                  {/* Percentage Breakdown */}
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Visual Bar */}
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="h-20 bg-gray-700 rounded-xl overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[70%] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">70% Artist/Venue</span>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 h-20 bg-gradient-to-r from-brand-400 to-brand-500 w-[30%] flex items-center justify-center rounded-r-xl">
                          <span className="text-white font-bold text-lg">30% Uplift</span>
                        </div>
                      </div>

                      {/* Example Calculation */}
                      <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                        <h4 className="text-white font-semibold mb-4">Example: $100 Ticket</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Face Value</span>
                            <span className="text-blue-400 font-bold">$70</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Charity Uplift</span>
                            <span className="text-brand-400 font-bold">$30</span>
                          </div>
                          <div className="border-t border-white/20 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-semibold">Your Impact</span>
                              <span className="text-brand-400 font-bold text-lg">$30 to charity</span>
                            </div>
                            <p className="text-white/50 text-xs mt-3 italic">*platform fee 2.5% + $1.69 on each ticket sold</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Charity Partners */}
                    <div>
                      <h4 className="text-white font-semibold text-xl mb-6">Featured Charity Partners</h4>

                      {/* Artist Charities Bubble */}
                      <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Mic className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">Artist Charities</p>
                        <p className="text-white/70 text-sm">Supporting causes close to performers' hearts</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Apple className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium text-sm">Feed the Children</p>
                          <p className="text-white/60 text-xs">Hunger Relief</p>
                          <p className="text-white/50 text-xs mt-2 italic">*Charitable Tax Receipt Provided</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Droplets className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium text-sm">Clean Water Fund</p>
                          <p className="text-white/60 text-xs">Water Access</p>
                          <p className="text-white/50 text-xs mt-2 italic">*Charitable Tax Receipt Provided</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium text-sm">Education First</p>
                          <p className="text-white/60 text-xs">School Programs</p>
                          <p className="text-white/50 text-xs mt-2 italic">*Charitable Tax Receipt Provided</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HomeIcon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium text-sm">Housing Heroes</p>
                          <p className="text-white/60 text-xs">Shelter Support</p>
                          <p className="text-white/50 text-xs mt-2 italic">*Charitable Tax Receipt Provided</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Stories */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Real Impact Stories</h3>

                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Story 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-6 border border-pink-500/20"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src="/TaylorSwift.webp"
                            alt="Taylor Swift"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Taylor Swift</h4>
                          <p className="text-white/60 text-sm">Eras Tour Impact</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        "Last month's uplift from Taylor Swift tickets funded <strong className="text-pink-400">10,000 meals</strong> for kids in need through our partnership with Feed the Children."
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full">$45,000 raised</span>
                        <span className="text-white/60">• Nov 2024</span>
                      </div>
                    </motion.div>

                    {/* Story 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/20"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src="/ladygaga.jpg"
                            alt="Lady Gaga"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Lady Gaga</h4>
                          <p className="text-white/60 text-sm">Born This Way Tour</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        "Gaga fans helped build <strong className="text-purple-400">3 clean water wells</strong> in rural communities, providing safe drinking water to over 1,500 people."
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">$62,000 raised</span>
                        <span className="text-white/60">• Oct 2024</span>
                      </div>
                    </motion.div>

                    {/* Story 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-500/20"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src="/GarthBrooks.jpg"
                            alt="Garth Brooks"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Garth Brooks</h4>
                          <p className="text-white/60 text-sm">Stadium Tour</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        "Country music fans united to fund <strong className="text-amber-400">200 school backpacks</strong> filled with supplies for students in underserved communities."
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">$28,000 raised</span>
                        <span className="text-white/60">• Sep 2024</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-brand-400/20 to-purple-600/20 rounded-2xl p-8 border border-brand-400/30"
                  >
                    <h4 className="text-2xl font-bold text-white mb-4">Ready to Make an Impact?</h4>
                    <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                      Your next concert ticket doesn't just get you great seats – it helps change lives.
                      Join thousands of music fans making a difference with every purchase.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <button
                        onClick={scrollToArtistCards}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        Buy Tickets & Give Back
                      </button>
                      <Link
                        href="/about"
                        className="bg-transparent border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl transition-all font-medium"
                      >
                        Learn About Our Impact
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              className="mt-16 mb-8"
            >
              <p className="text-white/50 text-sm text-center">
                © 2025 Give Back Ticketing Platform
              </p>
            </motion.div>
          </div>
        </main>

        {/* Bottom Right Badge */}
        <div className="absolute bottom-8 right-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
