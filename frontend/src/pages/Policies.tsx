import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Policies() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('shipping');

  // Auto-select tab based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['shipping'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">


        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-100 overflow-x-auto">
            {[

              { id: 'shipping', label: 'Shipping & Bulk Orders' }

            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-4 font-bold text-sm tracking-wider uppercase whitespace-nowrap transition-colors flex-1 text-center",
                  activeTab === tab.id ? "bg-[#0B4D26] text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 px-8 md:px-12 pt-8 pb-2">
            <Link to="/shop" className="bg-[#1B4332] text-white px-8 py-3 rounded-xl font-bold text-center hover:bg-[#133224] transition-colors shadow-sm flex-1 sm:flex-none">
              Make a Order
            </Link>
            <Link to="/contact" className="bg-white text-[#1B4332] border-2 border-[#1B4332] px-8 py-3 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors shadow-sm flex-1 sm:flex-none">
              Bulk Order Enquiry
            </Link>
          </div>

          <div className="p-8 md:p-12 max-w-none text-gray-700 space-y-6">
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Shipping & Bulk Orders</h2>
                <p className="text-sm text-gray-500">Last updated: August 2026</p>
                <p>We are proud to offer reliable delivery services across Tamil Nadu.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">1. Standard Delivery</h3>
                <p>We currently deliver across all districts in Tamil Nadu. Standard delivery takes 2-4 business days.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">2. Shipping Costs</h3>
                <p>We offer free standard shipping on all orders over ₹2,000. For orders below this amount, a flat rate of ₹150 applies.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">3. Bulk Orders & B2B</h3>
                <p>For large farm orders or wholesale inquiries (over 50kg), we provide specialized transport and discounted bulk rates. Bulk orders may require up to 7 business days for transport arrangement. Please <Link to="/contact" className="text-[#1B4332] underline font-medium">Contact Us</Link> directly to schedule a bulk delivery.</p>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
