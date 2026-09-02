import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { cartItems, cartSubtotal, cartCount, setCartItems } = useCart() as any; // Cast temporarily since we need clear cart
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          line1: formData.address1,
          line2: formData.address2,
          city: formData.city,
          pincode: formData.pinCode,
        },
        items: cartItems.map((item: any) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          variant: item.selectedVariant,
          price: Number(item.price) * (item.selectedVariant / (item.variants[0] || 1))
        })),
        subtotal: cartSubtotal,
        shippingFee: 0,
        total: cartSubtotal,
        paymentMethod: paymentMethod
      };

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      // Success! Clear cart (if the method exists, we'll implement it or just reset state here)
      // Since CartContext doesn't expose clearCart, we might just force reload or navigate away.
      if (setCartItems) setCartItems([]);
      
      navigate('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="bg-[#0B4D26] text-white px-6 py-3 rounded-lg font-bold">Return to Shop</Link>
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

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Step 1: Address */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 1 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 1 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
                  Delivery Details
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-[#0B4D26] font-bold text-sm">Edit</button>
                )}
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                  </div>
                  <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} placeholder="Flat, House no., Building, Company" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                  <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} placeholder="Area, Street, Sector, Village" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Town/City" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="PIN Code" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26]" required />
                  </div>
                  <button 
                    onClick={() => {
                      if(formData.firstName && formData.phone && formData.address1 && formData.city) {
                        setStep(2);
                      } else {
                        setError('Please fill in all required fields');
                      }
                    }}
                    className="w-full bg-[#0B4D26] text-white font-bold py-4 rounded-xl mt-4"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white rounded-2xl shadow-sm border ${step === 2 ? 'border-[#0B4D26] ring-1 ring-[#0B4D26]' : 'border-gray-100'} p-6 md:p-8`}>
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-[#0B4D26] text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
                Payment Method
              </h2>
              
              {step === 2 && (
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#0B4D26] focus:ring-[#0B4D26]" />
                      <span className="font-medium text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#0B4D26] focus:ring-[#0B4D26]" />
                      <span className="font-medium text-gray-900">Credit / Debit Card</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#0B4D26] focus:ring-[#0B4D26]" />
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                    </div>
                  </label>
                  
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-5 h-5" /> {isSubmitting ? 'Processing...' : `Place Order • ₹${cartSubtotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-96 shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100 max-h-60 overflow-y-auto">
                  {cartItems.map((item: any) => {
                    const price = Number(item.price) * (item.selectedVariant / (item.variants[0] || 1));
                    return (
                      <div key={`${item.id}-${item.selectedVariant}`} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 object-cover" />
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-gray-500">{item.selectedVariant} kg/L × {item.quantity}</p>
                        </div>
                        <div className="ml-auto font-bold shrink-0">₹{(price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-green-600">Free</span></div>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0B4D26]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
