'use client';
import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Refund & Return Policy</h2>

            <p>We want you to be completely satisfied with your purchase from Royal Uzhavan.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">1. Returns</h3>
            <p>Since we deal with perishable and food items, returns are generally not accepted. However, if you receive a damaged or incorrect product, please contact us within 24 hours of delivery.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">2. Refunds</h3>
            <p>Refunds will be processed within 1hr-24hr business days if your claim for a damaged or incorrect item is approved. The refund will be credited back to your original payment method.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">3. Cancellations</h3>
            <p>If your request for damaged or incorrect items is accepted, excluding any items you have used from the returned goods, the refund for the remaining items will be credited back via your original payment method within 1 to 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

