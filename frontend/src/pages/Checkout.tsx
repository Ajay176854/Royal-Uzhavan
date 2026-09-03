import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
    pincode: ''
  });
  const [addressError, setAddressError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartTotal;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('ru_token');
      const orderData = {
        customerName: `${address.firstName} ${address.lastName}`.trim(),
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: `${address.flat}, ${address.area}, ${address.city} - ${address.pincode}`,
        items: items.map(i => ({
          product_id: i.productId,
          name: i.name,
          image: i.image,
          variant: String(i.selectedVariant),
          quantity: i.quantity,
          price: i.price
        })),
        subtotal: subtotal,
        shippingFee: 0,
        total: subtotal,
        paymentMethod: 'cod'
      };

      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        
        // Backend handles WhatsApp automation via Meta API
        
        navigate('/account');
      } else {
        const error = await res.json();
        alert('Failed to place order: ' + error.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order. Please make sure you are logged in.');
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
                    <input type="tel" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="email" placeholder="Email Address" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  <input type="text" placeholder="Flat, House no., Building, Company, Apartment" value={address.flat} onChange={e => setAddress({...address, flat: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <input type="text" placeholder="Area, Street, Sector, Village" value={address.area} onChange={e => setAddress({...address, area: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Town/City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                    <input type="text" placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0B4D26] focus:ring-1 focus:ring-[#0B4D26]" />
                  </div>
                  
                  {addressError && (
                    <div className="text-red-500 text-sm font-medium px-1">
                      {addressError}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      const { firstName, lastName, phone, email, flat, area, city, pincode } = address;
                      if (!firstName || !lastName || !phone || !email || !flat || !area || !city || !pincode) {
                        setAddressError('Please fill out all the blank spaces before continuing.');
                        return;
                      }
                      setAddressError('');
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
                  <div className="p-4 border border-[#0B4D26]/20 bg-[#0B4D26]/5 rounded-lg mb-6">
                    <p className="font-bold text-[#0B4D26] mb-1">Payment Method: Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-700">You will pay for your order when it is delivered to your address.</p>
                  </div>
                  
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-gray-900 font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-5 h-5" /> {isSubmitting ? 'Processing...' : `Place Order • ₹${subtotal.toLocaleString('en-IN')}`}
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
                  <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-green-600">Free</span></div>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0B4D26]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
