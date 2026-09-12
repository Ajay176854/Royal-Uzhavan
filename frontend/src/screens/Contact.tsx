'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { localApi } from '../services/localApi';

export default function Contact() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    localApi.getSettings().then(setSettings).catch(console.error);
  }, []);

  const formatTime = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(':00', '').toLowerCase().replace(' ', '');
  };

  const phoneHref = settings?.contact_phone ? settings.contact_phone.replace(/[^0-9+]/g, '') : '+918072864890';
  const whatsappNumber = settings?.contact_phone ? settings.contact_phone.replace(/[^0-9]/g, '') : '918072864890';
  
  const supportStartDay = settings?.support_start_day || 'Mon';
  const supportEndDay = settings?.support_end_day || 'Sat';
  const supportStartTime = formatTime(settings?.support_start_time || '09:00');
  const supportEndTime = formatTime(settings?.support_end_time || '18:00');
  const formattedTiming = `${supportStartDay}-${supportEndDay}, ${supportStartTime} to ${supportEndTime}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-[#0B4D26] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-green-100">
            Have questions about our feeds, need bulk pricing, or want farming advice? Our team of experts is here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">We usually respond within 24 hours during business days.</p>
            </div>
            
            <div className="space-y-6">
              <a href={`tel:${phoneHref}`} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#0B4D26]/30 transition-colors group">
                <div className="w-12 h-12 bg-[#0B4D26]/10 rounded-full flex items-center justify-center text-[#0B4D26] group-hover:bg-[#0B4D26] group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Phone Support</h3>
                  <p className="text-gray-600 mb-2">{formattedTiming}</p>
                  <p className="text-[#0B4D26] font-bold text-xl">{settings?.contact_phone || '8072864890'}</p>
                </div>
              </a>
              
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-500/30 transition-colors group">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">WhatsApp</h3>
                  <p className="text-gray-600 mb-2">For quick queries and ordering</p>
                  <p className="text-green-600 font-bold text-xl">Chat with us</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Main Office</h3>
                  <p className="text-gray-600">
                    {settings?.contact_address ? (
                      settings.contact_address.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        Kuruthencode,<br/>Kanniyakumari District,<br/>Tamil Nadu, India
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const phone = formData.get('phone');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                const waMessage = `*New Contact Message*
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email || 'N/A'}
*Subject:* ${subject}

*Message:*
${message}`;
                
                const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
                window.open(waUrl, '_blank');
                e.currentTarget.reset();
              }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26] bg-gray-50 focus:bg-white transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26] bg-gray-50 focus:bg-white transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Optional)</label>
                <input type="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26] bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select name="subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26] bg-gray-50 focus:bg-white transition-colors cursor-pointer">
                  <option value="Bulk Order Inquiry">Bulk Order Inquiry</option>
                  <option value="Product Information">Product Information</option>
                  <option value="Order Tracking">Order Tracking</option>
                  <option value="Farm Consultation">Farm Consultation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26] bg-gray-50 focus:bg-white transition-colors resize-none" required></textarea>
              </div>
              <button type="submit" className="w-full bg-[#0B4D26] hover:bg-[#07361a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-lg">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}

