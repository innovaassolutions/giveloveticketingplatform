'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, LogOut } from 'lucide-react';

interface SimplePasswordProtectionProps {
  children: React.ReactNode;
  password?: string;
  storageKey?: string;
  title?: string;
  description?: string;
}

export default function SimplePasswordProtection({
  children,
  password = 'givelovek2025',
  storageKey = 'simpleAdminAuthenticated',
  title = 'Admin Access',
  description = 'Enter the admin password to continue'
}: SimplePasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem(storageKey);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Add a small delay for better UX
    setTimeout(() => {
      if (inputPassword === password) {
        setIsAuthenticated(true);
        localStorage.setItem(storageKey, 'true');
      } else {
        setError('Incorrect password. Please try again.');
        setInputPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(storageKey);
  };

  if (isAuthenticated) {
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
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white/70">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white/70 mb-2 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
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
              disabled={isLoading || !inputPassword}
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
            <p className="text-white/40 text-xs text-center">
              Password: giveback2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}