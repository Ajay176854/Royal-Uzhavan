import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MessageCircle, ShoppingCart, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MobileNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { 
      name: 'WhatsApp', 
      path: 'https://wa.me/919159944366', 
      icon: MessageCircle,
      external: true 
    },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: 0 },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
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
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors relative",
                isActive ? "text-[#0B4D26]" : "text-gray-500 hover:text-[#0B4D26]"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#C9A227] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
