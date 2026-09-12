'use client';
import React from 'react';

export default function TermsOfService() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h2>

            <p>By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">1. Use of Service</h3>
            <p>Our website is intended to provide natural farm products directly to consumers. You may not use our products for any illegal or unauthorized purpose.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">2. Pricing and Availability</h3>
            <p>All prices are subject to change without notice. We reserve the right to modify or discontinue any product without prior notice.</p>

          </div>
        </div>
      </div>
    </div>
  );
}

