import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-wabi-bg)] border-t border-[var(--color-wabi-earth)]/20 pb-16 md:pb-0">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="flex flex-col text-left justify-center mb-5 sm:mb-6 group inline-flex"
            >
              <span className="text-[#1B4332] text-xl sm:text-2xl md:text-[26px] font-serif font-bold tracking-tight leading-[0.85]">
                Royal
              </span>

              <span className="text-[#C9A227] text-xl sm:text-2xl md:text-[26px] font-serif font-bold tracking-tight leading-[0.85]">
                Uzhavan
              </span>

              <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] text-[#5c8a2b] font-black tracking-[0.2em] uppercase mt-1.5 flex items-center gap-1">
                <span className="w-2.5 sm:w-3 md:w-4 h-[2px] bg-[#86B841]/40 rounded-full shrink-0"></span>
                Traditional Farms 🌾
              </span>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed mb-5 sm:mb-6 max-w-md lg:max-w-none">
              Farm fresh, grow with nature. Bringing you 100% natural, traditional rice, cold-pressed oils, and fresh greens directly from our farms.
            </p>

            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/uzhavan_birds_food_accessories"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors shrink-0"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com/@mybusiness469?si=g8EgjTnVOXcI1YTD"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors shrink-0"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="col-span-1">
            <h4 className="text-[var(--color-wabi-green)] font-serif text-lg sm:text-xl mb-4 sm:mb-6">
              Explore
            </h4>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Shop All
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Traditional%20Rice"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Traditional Rice
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Cold%20Pressed%20Edible%20Oil"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Cold Pressed Oils
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Vegetables"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Fresh Keerai & Veggies
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Farm%20Pantry"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Farm Pantry
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-[var(--color-wabi-green)] font-serif text-lg sm:text-xl mb-4 sm:mb-6">
              Company
            </h4>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/our-farms"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Our Farms
                </Link>
              </li>

              <li>
                <Link
                  to="/subscriptions"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Subscribe & Save
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[var(--color-wabi-green)] font-serif text-lg sm:text-xl mb-4 sm:mb-6">
              Contact
            </h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0 mt-0.5" />

                <span className="text-gray-500 text-sm leading-relaxed">
                  Kuruthencode,
                  <br />
                  Kanniyakumari District,
                  <br />
                  Tamil Nadu
                </span>
              </li>

              <li className="flex items-center gap-3 min-w-0">
                <Phone className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0" />

                <a
                  href="tel:+918072864890"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors break-words"
                >
                  +91 80-72864890
                </a>
              </li>

              <li className="flex items-start sm:items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0 mt-0.5 sm:mt-0" />

                <a
                  href="mailto:hello@royaluzhavan.com"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors break-all"
                >
                  hello@royaluzhavan.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[var(--color-wabi-earth)]/20">
        <div
          className="
            container mx-auto
            px-4 sm:px-6 md:px-8
            py-5 sm:py-6 md:py-0
            md:min-h-16
            flex flex-col-reverse md:flex-row
            items-center md:items-center
            justify-between
            gap-6 md:gap-4
          "
        >
          {/* Copyright */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <span className="tracking-widest opacity-80 text-[9px] sm:text-[10px] text-center">
              © 2026 ROYAL UZHAVAN
            </span>
          </div>

          {/* Payment Partners */}
          <div
            className="
              flex flex-col
              sm:flex-row
              items-center
              justify-center
              md:justify-end
              gap-3 sm:gap-4
              w-full md:w-auto
            "
          >
            <span className="uppercase tracking-widest text-[var(--color-wabi-green)]/50 text-[9px] sm:text-[10px] text-center whitespace-nowrap">
              Payment Partners
            </span>

            <div className="flex flex-wrap justify-center gap-2">
              {/* UPI */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center w-[46px] sm:w-[48px] h-[30px] shrink-0">
                <div className="flex items-center">
                  <span className="text-gray-700 font-black italic tracking-tighter text-[14px] leading-none pr-0.5">
                    UPI
                  </span>

                  <div className="flex flex-col -ml-0.5">
                    <div className="w-1.5 h-1.5 bg-[#F79E1B] rotate-45 transform translate-y-0.5"></div>
                    <div className="w-1.5 h-1.5 bg-[#03A853] rotate-45 transform -translate-y-0.5"></div>
                  </div>
                </div>
              </div>

              {/* VISA */}
              <div className="bg-[#1434CB] rounded-md shadow-sm border border-[#1434CB] flex items-center justify-center w-[46px] sm:w-[48px] h-[30px] shrink-0 overflow-hidden">
                <span className="text-white font-black italic tracking-wider text-[13px] font-sans">
                  VISA
                </span>
              </div>

              {/* Mastercard */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center w-[46px] sm:w-[48px] h-[30px] shrink-0">
                <svg viewBox="0 0 100 60" className="w-7 h-5">
                  <circle cx="35" cy="30" r="24" fill="#EB001B" />
                  <circle cx="65" cy="30" r="24" fill="#F79E1B" />
                  <path
                    d="M50 16.5a24 24 0 000 33a24 24 0 000-33z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>

              {/* RuPay */}
              <div className="bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center w-[46px] sm:w-[48px] h-[30px] shrink-0 gap-[1px]">
                <span className="text-[#002E6E] font-black italic tracking-tighter text-[12px] ml-1">
                  RuPay
                </span>

                <div className="flex flex-col mt-0.5">
                  <span className="text-[#F79E1B] text-[10px] font-black leading-[0.35]">
                    ›
                  </span>
                  <span className="text-[#03A853] text-[10px] font-black leading-[0.35]">
                    ›
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

