'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MobileNav() {
  const pathname = usePathname();
  const path = pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    {
      name: 'WhatsApp',
      path: 'https://wa.me/918072864890',
      icon: MessageCircle,
      external: true
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.path;

          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => window.dispatchEvent(new Event('close-mobile-menu'))}
                className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-green-600 transition-colors"
              >
                <Icon className="w-5 h-5 mb-1 text-green-600" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => window.dispatchEvent(new Event('close-mobile-menu'))}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors relative",
                isActive ? "text-[#0B4D26]" : "text-gray-500 hover:text-[#0B4D26]"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


