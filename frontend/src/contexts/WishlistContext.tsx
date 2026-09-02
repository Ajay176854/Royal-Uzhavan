import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isLiked: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('royal_uzhavan_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('royal_uzhavan_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isLiked = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isLiked }}>
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
