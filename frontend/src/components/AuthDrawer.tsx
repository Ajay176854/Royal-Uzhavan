import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthDrawer() {
  const { isAuthOpen, setIsAuthOpen, login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/signup';
      const body = isLoginView 
        ? { email, password }
        : { name, email, password, phone };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      setIsAuthOpen(false); // Close drawer on success
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isAuthOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsAuthOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out ${isAuthOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-playfair font-bold text-[#1B4332]">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 text-sm mb-6">
            {isLoginView ? 'Sign in to access your orders and wishlist.' : 'Join Royal Uzhavan today!'}
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginView && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#86B841] focus:ring-1 focus:ring-[#86B841]"
                  placeholder="••••••••"
                />
              </div>
              {!isLoginView && (
                <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters.</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#86B841] text-white font-bold py-3 rounded-lg hover:bg-[#729c36] transition-colors mt-6 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Please wait...' : (isLoginView ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-600 text-sm">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLoginView(!isLoginView)}
                className="ml-2 text-[#1B4332] font-bold hover:underline focus:outline-none"
              >
                {isLoginView ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
