import React, { useState } from 'react';
import { cn } from '../lib/utils';

export default function Policies() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Legal & Policies</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-100 overflow-x-auto">
            {[
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'terms', label: 'Terms & Conditions' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'refund', label: 'Refund & Returns' }
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
          
          <div className="p-8 md:p-12 max-w-none text-gray-700 space-y-6">
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-sm text-gray-500">Last updated: August 2026</p>
                <p>At Royal Uzhavan, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us through our website and services.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">1. Information We Collect</h3>
                <p>We may collect personal information such as your name, contact details, farm address, and payment information when you register an account, place an order, or subscribe to our newsletter.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">2. How We Use Your Information</h3>
                <p>Your information is used to process orders, arrange delivery, provide customer support, and send relevant updates regarding our products and farming advice.</p>
              </div>
            )}
            
            {activeTab === 'terms' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
                <p className="text-sm text-gray-500">Last updated: August 2026</p>
                <p>Welcome to Royal Uzhavan. By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">1. Product Information</h3>
                <p>We strive to ensure all product descriptions, ingredients, and feeding guidelines are accurate. However, we recommend consulting with a veterinary professional for specific dietary needs of your livestock.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">2. Pricing & Availability</h3>
                <p>All prices are subject to change without notice. Products are subject to availability, and we reserve the right to limit the quantity of items purchased per person or per order.</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Shipping & Delivery Policy</h2>
                <p className="text-sm text-gray-500">Last updated: August 2026</p>
                <p>We are proud to offer reliable delivery services across Tamil Nadu.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">1. Delivery Areas & Timeframes</h3>
                <p>We currently deliver across all districts in Tamil Nadu. Standard delivery takes 2-4 business days. Bulk orders (over 50 bags) may require up to 7 business days for specialized transport arrangement.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">2. Shipping Costs</h3>
                <p>We offer free standard shipping on all orders over ₹2,000. For orders below this amount, a flat rate of ₹150 applies.</p>
              </div>
            )}

            {activeTab === 'refund' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Refund & Cancellation Policy</h2>
                <p className="text-sm text-gray-500">Last updated: August 2026</p>
                <p>We stand behind the quality of our feed. If you are not satisfied with your purchase, we are here to help.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">1. Returns</h3>
                <p>You have 7 calendar days to return an item from the date you received it. To be eligible for a return, the bag must be unopened, in its original packaging, and in the same condition that you received it.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-6">2. Refunds</h3>
                <p>Once we receive your item, we will inspect it and notify you. If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within 5-7 business days.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
