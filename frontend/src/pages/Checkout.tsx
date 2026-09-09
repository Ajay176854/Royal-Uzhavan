import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

import { motion, AnimatePresence } from 'motion/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    flat: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [addressError, setAddressError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = cartTotal;
  const shippingFee = subtotal >= 500 ? 0 : 50;
  const estimatedTotal = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setOrderError('');
    try {
      const token = localStorage.getItem('token');

      // Build the payload the backend expects:
      // - items as [{ productId, quantity }] — backend looks up real prices
      // - shippingAddress as a structured object — backend validates each field
      // - NO subtotal/total — backend calculates everything server-side
      const orderData = {
        customerName: `${address.firstName} ${address.lastName}`.trim(),
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          street: `${address.flat}, ${address.area}`.trim(),
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod: 'cod'
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        setOrderNumber(data.order?.orderNumber || '');
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/account');
        }, 2500);
      } else {
        // Show specific error from backend (out of stock, blacklisted, duplicate, validation, etc.)
        setOrderError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setOrderError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/shop" className="bg-[#0B4D26] text-white px-6 py-2 rounded-lg">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[#C9A227] font-playfair font-bold text-sm tracking-widest leading-none mb-1">ROYAL</span>
              <div className="bg-[#0B4D26] text-white px-3 py-1 rounded-sm">
                <span className="font-bold text-2xl leading-none">உழவன்</span>
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Step 1: Address */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 1 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 1 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
                  Delivery Address
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-[#0B4D26] font-bold text-sm">Edit</button>
                )}
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="Last Name" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Phone Number (10 digits)" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="email" placeholder="Email Address" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  <input type="text" placeholder="Flat, House no., Building, Company, Apartment" value={address.flat} onChange={e => setAddress({...address, flat: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <input type="text" placeholder="Area, Street, Sector, Village" value={address.area} onChange={e => setAddress({...address, area: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Town/City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="PIN Code" maxLength={6} value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  
                  {addressError && (
                    <div className="text-red-500 text-sm font-medium px-1">
                      {addressError}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      const { firstName, lastName, phone, email, flat, area, city, state, pincode } = address;
                      if (!firstName || !lastName || !phone || !email || !flat || !area || !city || !state || !pincode) {
                        setAddressError('Please fill out all the fields before continuing.');
                        return;
                      }
                      // Basic client-side validations (backend does thorough validation too)
                      if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-\+]/g, '').replace(/^91/, ''))) {
                        setAddressError('Please enter a valid 10-digit Indian mobile number.');
                        return;
                      }
                      if (!/^[1-9]\d{5}$/.test(pincode)) {
                        setAddressError('Please enter a valid 6-digit PIN code.');
                        return;
                      }
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        setAddressError('Please enter a valid email address.');
                        return;
                      }
                      setAddressError('');
                      setOrderError('');
                      setStep(2);
                    }}
                    className="w-full bg-[#0B4D26] text-white font-bold py-4 rounded-xl mt-4"
                  >
                    Continue to Review
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Verify & Place Order */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 2 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
                Verify & Place Order
              </h2>
              
              {step === 2 && (
                <div className="space-y-4">
                  {/* Delivery address summary */}
                  <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900">{address.firstName} {address.lastName}</p>
                    <p>{address.flat}, {address.area}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.phone} · {address.email}</p>
                  </div>

                  <div className="p-4 border border-[#0B4D26]/20 bg-[#0B4D26]/5 rounded-lg">
                    <p className="font-bold text-[#0B4D26] mb-1">Payment Method: Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-700">You will pay for your order when it is delivered to your address.</p>
                  </div>

                  {orderError && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <p className="text-red-700 font-medium text-sm">{orderError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-5 h-5" /> {isSubmitting ? 'Processing...' : `Place Order • ₹${estimatedTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-96 shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.selectedVariant}`} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 object-cover" />
                      <div>
                        <h4 className="font-bold line-clamp-1">{item.name}</h4>
                        <p className="text-gray-500">{item.selectedVariant} × {item.quantity}</p>
                      </div>
                      <div className="ml-auto font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span></div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-green-600">Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free shipping!</p>
                  )}
                </div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0B4D26]">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">Final total confirmed by server at checkout</p>
             </div>
          </div>

        </div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-2xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: 'spring', delay: 0.2, damping: 10, stiffness: 200 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Order Placed!</h2>
              {orderNumber && (
                <p className="text-[#0B4D26] font-bold text-lg mb-3">Order #{orderNumber}</p>
              )}
              <p className="text-gray-600 font-medium mb-8 text-sm leading-relaxed">
                Thank you for choosing Royal Uzhavan! Your order has been successfully placed. Our team is now preparing your premium farm-fresh products for dispatch. You will receive a WhatsApp confirmation shortly with your tracking details.
              </p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.3, ease: "linear" }}
                  className="h-full bg-green-600 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-400 mt-4 font-bold tracking-widest uppercase">Redirecting...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
