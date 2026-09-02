import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Backend URL - assuming Vite proxy or full URL
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    if (isLoggedIn && user) {
      // Fetch wishlist from backend
      fetch(`${API_URL}/wishlist/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.wishlist) setWishlist(data.wishlist);
        })
        .catch(err => console.error("Failed to fetch wishlist", err));
    } else {
      // Reset wishlist when user logs out or is a guest (temporary state)
      setWishlist([]);
    }
  }, [isLoggedIn, user]);

  const toggleWishlist = async (productId: string) => {
    const currentlyLiked = wishlist.includes(productId);
    
    // Optimistic UI update
    setWishlist(prev => 
      currentlyLiked 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    if (isLoggedIn && user) {
      try {
        let response;
        if (currentlyLiked) {
          response = await fetch(`${API_URL}/wishlist/${user.id}/${productId}`, {
            method: 'DELETE'
          });
        } else {
          response = await fetch(`${API_URL}/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.id,
              productId: productId
            })
          });
        }
        
        if (!response.ok) {
          // Revert optimistic update on failure
          setWishlist(prev => 
            currentlyLiked 
              ? [...prev, productId]
              : prev.filter(id => id !== productId)
          );
          console.error("Failed to update wishlist on server");
        }
      } catch (err) {
        // Revert on failure
        setWishlist(prev => 
          currentlyLiked 
            ? [...prev, productId]
            : prev.filter(id => id !== productId)
        );
        console.error("Network error updating wishlist", err);
      }
    }
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
