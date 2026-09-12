'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SiteLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep the loading screen for a minimum duration to show the animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-wabi-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Logo Text */}
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-wabi-green)] mb-6 text-center">
              Royal <span className="italic text-[var(--color-wabi-earth)]">Uzhavan</span>
            </h1>
            
            {/* Loading Bar */}
            <div className="w-64 h-[2px] bg-[var(--color-wabi-earth)]/20 overflow-hidden relative rounded-full">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-[var(--color-wabi-gold)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            
            {/* Tagline */}
            <motion.p 
              className="mt-6 text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-wabi-green)]/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Animal Nutrition
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

