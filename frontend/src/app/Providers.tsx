'use client';

import React from 'react';
import { WishlistProvider } from '../contexts/WishlistContext';
import SiteLoader from '../components/SiteLoader';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <SiteLoader />
      {children}
    </WishlistProvider>
  );
}
