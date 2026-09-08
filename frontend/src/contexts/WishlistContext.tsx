import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoggedIn, setIsAuthOpen } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  // Fetch wishlist from backend when user logs in
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist.map((item: any) => item.id));
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync wishlist when auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isLoggedIn, fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    // If not logged in, open auth drawer
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    const token = getToken();
    if (!token) return;

    const isCurrentlyLiked = wishlist.includes(productId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }

    try {
      if (isCurrentlyLiked) {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to remove');
      } else {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to add');
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      // Revert optimistic update on failure
      if (isCurrentlyLiked) {
        setWishlist(prev => [...prev, productId]);
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
      }
    }
  };

  const isLiked = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isLiked, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
