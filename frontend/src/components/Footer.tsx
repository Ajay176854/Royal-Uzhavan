'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { localApi } from '../services/localApi';
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Sprout,
} from 'lucide-react';

// Inline SVG icons for Instagram and YouTube (lucide-react removed brand icons)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    localApi.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <footer className="bg-[var(--color-wabi-bg)] border-t border-[var(--color-wabi-earth)]/20 pb-16 md:pb-0">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
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
              Premium quality animal feeds and nutritional supplements. Bringing you 100% natural, traditional feeds directly from our farms.
            </p>

            <div className="flex gap-3">
              <a
                href={settings?.instagram_link || "https://www.instagram.com/uzhavan_birds_food_accessories"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors shrink-0"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={settings?.youtube_link || "https://youtube.com/@mybusiness469?si=g8EgjTnVOXcI1YTD"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-[var(--color-wabi-earth)]/10 flex items-center justify-center text-[var(--color-wabi-green)] hover:bg-[var(--color-wabi-green)] hover:text-white transition-colors shrink-0"
              >
                <YoutubeIcon className="w-4 h-4" />
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
                  href="/cow"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Cattle Feeds
                </Link>
              </li>

              <li>
                <Link
                  href="/hen"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Poultry Feeds
                </Link>
              </li>

              <li>
                <Link
                  href="/pigeon"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Pigeon & Birds Foods
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Hen%20and%20Pigeon%20Supplements"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Nutritional Supplements
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
                  href="/our-farms"
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-earth)] transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Our Farms
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
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
                  {settings?.contact_address ? (
                    settings.contact_address.split('\n').map((line: string, i: number) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      2/11/9, Asaarivilai, Saral post,
                      <br />
                      Kanniyakumari District,
                      <br />
                      Tamil Nadu - 629203
                    </>
                  )}
                </span>
              </li>

              <li className="flex items-center gap-3 min-w-0">
                <Phone className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0" />

                <a
                  href={`tel:${settings?.contact_phone?.replace(/[^0-9+]/g, '') || '+918072864890'}`}
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors break-words"
                >
                  {settings?.contact_phone || '+91 80-72864890'}
                </a>
              </li>

              <li className="flex items-start sm:items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-[var(--color-wabi-earth)] shrink-0 mt-0.5 sm:mt-0" />

                <a
                  href={`mailto:${settings?.contact_email || 'royaluzhavan@gmail.com'}`}
                  className="text-gray-500 text-sm hover:text-[var(--color-wabi-green)] transition-colors break-all"
                >
                  {settings?.contact_email || 'royaluzhavan@gmail.com'}
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

          {/* Trust Badges */}
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
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-4 h-4 text-[var(--color-wabi-green)]" />
                <span className="uppercase tracking-widest text-[var(--color-wabi-green)] text-[9px] sm:text-[10px] font-bold">Quality Assured</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <Leaf className="w-4 h-4 text-[var(--color-wabi-green)]" />
                <span className="uppercase tracking-widest text-[var(--color-wabi-green)] text-[9px] sm:text-[10px] font-bold">100% Natural</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <Sprout className="w-4 h-4 text-[var(--color-wabi-green)]" />
                <span className="uppercase tracking-widest text-[var(--color-wabi-green)] text-[9px] sm:text-[10px] font-bold">Farm Direct</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
