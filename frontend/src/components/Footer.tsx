import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-wabi-bg)] border-t border-[var(--color-wabi-earth)]/20">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link to="/" className="flex flex-col leading-none mb-6 group inline-flex">
              <span className="text-[var(--color-wabi-earth)] text-xs font-serif italic mb-1">Royal</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[var(--color-wabi-green)] text-xl font-bold tracking-widest uppercase">Uzhavan</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Farm fresh, grow with nature. Bringing you 100% natural, traditional rice, cold-pressed oils, and fresh greens directly from our farms.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--color-wabi-green)] font-serif text-xl mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Shop All</Link></li>
              <li><Link to="/shop?category=Traditional%20Rice" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Traditional Rice</Link></li>
              <li><Link to="/shop?category=Cold%20Pressed%20Edible%20Oil" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Cold Pressed Oils</Link></li>
              <li><Link to="/shop?category=Vegetables" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Fresh Keerai & Veggies</Link></li>
              <li><Link to="/shop?category=Farm%20Pantry" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Farm Pantry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--color-wabi-green)] font-serif text-xl mb-6">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/our-farms" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Our Farms</Link></li>
              <li><Link to="/trace" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Traceability</Link></li>
              <li><Link to="/subscriptions" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Subscribe & Save</Link></li>
              <li><Link to="/contact" className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--color-wabi-green)] font-serif text-xl mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm leading-relaxed">Sathya Nagar, Vandavasi,<br/>Tiruvannamalai District,<br/>Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0" />
                <a href="tel:9159944366" className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors">9159944366</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0" />
                <a href="mailto:hello@royaluzhavan.com" className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors">hello@royaluzhavan.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-400 font-medium gap-4 bg-[var(--color-wabi-bg)] border-t border-[var(--color-wabi-earth)]/20">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
           <span className="text-center tracking-widest">© 2026 ROYAL UZHAVAN</span>
           <div className="flex gap-4 uppercase tracking-widest">
             <Link to="/policies?tab=refund" className="hover:text-[var(--color-wabi-green)] transition-colors">Refunds</Link>
             <Link to="/policies?tab=terms" className="hover:text-[var(--color-wabi-green)] transition-colors">Terms</Link>
             <Link to="/policies?tab=privacy" className="hover:text-[var(--color-wabi-green)] transition-colors">Privacy</Link>
           </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
          <span className="uppercase tracking-widest text-[var(--color-wabi-green)]/40 hidden sm:inline">Payment Partners</span>
          <div className="flex gap-2 opacity-40 grayscale">
            <div className="w-8 h-4 bg-[var(--color-wabi-earth)] rounded-sm"></div>
            <div className="w-8 h-4 bg-[var(--color-wabi-earth)] rounded-sm"></div>
            <div className="w-8 h-4 bg-[var(--color-wabi-earth)] rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
