'use client';
import React from 'react';
import Link from 'next/link';
import { Truck, Phone } from 'lucide-react';

export default function Policies() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Bulk Orders</h2>
            <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>
            <p>We are proud to offer reliable delivery services across Tamil Nadu.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">1. Delivery Areas & Timeframes</h3>
            <p>We currently deliver across all districts in Tamil Nadu. Standard delivery takes 2-4 business days. Bulk orders (over 50 bags) may require up to 7 business days for specialized transport arrangement.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">2. Shipping Costs</h3>
            <p>We offer free standard shipping on all orders over ₹2,000. For orders below this amount, a flat rate of ₹150 applies.</p>
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#0f291e] transition-colors">
                <Phone className="w-5 h-5" />
                Inquire for Bulk Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


