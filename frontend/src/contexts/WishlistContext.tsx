import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';


interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {

    try {
      const isCurrentlyLiked = wishlist.includes(productId);
      let newWishlist = [...wishlist];

      if (isCurrentlyLiked) {
        newWishlist = newWishlist.filter(id => id !== productId);
      } else {
        newWishlist.push(productId);
      }

      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const isLiked = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isLiked, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
