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
            <h3 className="text-lg text-gray-600 mb-6 font-semibold">ஷிப்பிங் & மொத்த ஆர்டர்கள்</h3>
            <p className="text-sm text-gray-500 mb-8"></p>
            
            <p>We are proud to offer reliable delivery services across Tamil Nadu.</p>
            <p className="mt-2 text-gray-600">தமிழ்நாடு முழுவதும் நம்பகமான டெலிவரி சேவைகளை வழங்குவதில் நாங்கள் பெருமிதம் கொள்கிறோம்.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6">1. Delivery Areas & Timeframes <span className="text-sm font-normal text-gray-600 ml-2">(டெலிவரி பகுதிகள் மற்றும் நேரங்கள்)</span></h3>
            <p>We currently deliver across all districts in Tamil Nadu. Standard delivery takes 2–4 business days. Bulk orders (over 50 bags) may require up to 7 business days for specialized transport arrangement.</p>
            <p className="mt-2 text-gray-600">நாங்கள் தற்போது தமிழ்நாட்டின் அனைத்து மாவட்டங்களுக்கும் டெலிவரி செய்கிறோம். சாதாரண டெலிவரிக்கு 2-4 வேலை நாட்கள் ஆகும். மொத்த ஆர்டர்களுக்கு (50 மூட்டைகளுக்கு மேல்) சிறப்பு போக்குவரத்து ஏற்பாட்டிற்கு 7 வேலை நாட்கள் வரை ஆகலாம்.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6">2. Shipping Costs <span className="text-sm font-normal text-gray-600 ml-2">(ஷிப்பிங் செலவுகள்)</span></h3>
            <p>We offer free shipping across Kanyakumari district, while deliveries to all other districts in Tamil Nadu are handled via courier on a "To-Pay" basis, payable upon arrival.</p>
            <p className="mt-2 text-gray-600">கன்னியாகுமரி மாவட்டம் முழுவதும் நாங்கள் இலவச ஷிப்பிங் வழங்குகிறோம், அதே சமயம் தமிழ்நாட்டில் உள்ள பிற மாவட்டங்களுக்கு கூரியர் மூலம் "To-Pay" அடிப்படையில் (பொருட்கள் வந்தடையும் போது பணம் செலுத்துதல்) டெலிவரி செய்யப்படுகிறது.</p>
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#0f291e] transition-colors">
                <Phone className="w-5 h-5" />
                Inquire for Bulk Orders <span className="font-normal text-sm ml-1 opacity-80">(விசாரிக்கவும்)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
