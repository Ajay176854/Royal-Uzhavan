import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
            <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>
            <p>We value your privacy and are committed to protecting your personal data.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">1. Information Collection</h3>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or when you participate in activities on the website.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">2. Use of Information</h3>
            <p>We use personal information collected via our website for a variety of business purposes described below, such as to facilitate account creation and logon process, and to fulfill and manage your orders.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6">3. Data Sharing</h3>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
