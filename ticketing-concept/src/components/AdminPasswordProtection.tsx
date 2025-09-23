'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, User, LogOut } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface AdminPasswordProtectionProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role restriction
}

export default function AdminPasswordProtection({ children, requiredRole }: AdminPasswordProtectionProps) {
  const { isAuthenticated, currentUser, authenticate, logout } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portalName, setPortalName] = useState('');

  // Set portal name client-side only to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/artist/')) {
      const name = window.location.pathname.split('/').pop()?.replace('-', ' ')?.replace(/\b\w/g, l => l.toUpperCase());
      setPortalName(name || '');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Add a small delay for better UX
    setTimeout(() => {
      const success = authenticate(username, password);
      if (!success) {
        setError('Incorrect username or password. Please try again.');
        setUsername('');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated()) {
    return (
      <div className="relative">
        {/* Logout Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
            {currentUser && (
              <span className="text-xs opacity-70">({currentUser.username})</span>
            )}
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/70">Enter your username and password to continue</p>
            {portalName && (
              <p className="text-purple-300 text-sm mt-2">
                Portal: {portalName}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-white/70 mb-2 text-sm font-medium">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter username"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white/70 mb-2 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-600/50 disabled:to-pink-600/50 text-white py-3 rounded-xl transition-all font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Access Admin'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs text-center mb-2">
              Available accounts: ladyg, garthb, taylors, dollyp, admin
            </p>
            <p className="text-white/40 text-xs text-center">
              All passwords: giveback2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}