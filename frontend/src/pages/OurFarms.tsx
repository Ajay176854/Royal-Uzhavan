import React from 'react';
import { Link } from 'react-router-dom';

export default function OurFarms() {
  return (
    <div className="bg-[var(--color-wabi-bg)] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[var(--color-wabi-green)] text-[var(--color-wabi-bg)] py-32 relative overflow-hidden">
        {/* Soft background texture element */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-wabi-gold) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <span className="text-[var(--color-wabi-gold)] font-bold tracking-[0.3em] text-[10px] uppercase mb-6 block">ESTD 1984</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8">Our Farming Heritage</h1>
          <p className="text-lg text-[var(--color-wabi-bg)]/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Rooted in Sathya Nagar, Vandavasi, Tiruvannamalai District. Royal Uzhavan is dedicated to producing and supplying reliable nutrition and feed for farmers, livestock, and poultry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="rounded-3xl overflow-hidden shadow-sm bg-[var(--color-wabi-earth)]/10 p-4">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80" alt="Farmer in field" className="w-full h-full object-cover aspect-[4/3] rounded-2xl sepia-[0.15] contrast-95" />
          </div>
          <div>
            <span className="text-[var(--color-wabi-earth)] font-serif italic text-lg mb-4 block">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-8 leading-tight">From Our Farm to Your Livestock</h2>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="mb-6 leading-relaxed">
                We started with a simple mission in Tiruvannamalai: to support farmers with high-quality, reliable nutrition for their animals. We recognize that healthy livestock, productive poultry, and thriving birds depend on proper, balanced diets.
              </p>
              <p className="leading-relaxed">
                Today, we produce and source the finest cattle feed, bird food, poultry supplements, and seed cakes. We ensure that when you feed your animals with Royal Uzhavan, you are giving them the absolute best nutrition directly from nature.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-32">
          <div className="p-12 bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 className="text-5xl font-serif text-[var(--color-wabi-green)] mb-6 italic">100%</h3>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-wabi-earth)] mb-3">Natural</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Committed to chemical-free, high-quality agricultural practices.</p>
          </div>
          <div className="p-12 bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 className="text-5xl font-serif text-[var(--color-wabi-green)] mb-6 italic">24hr</h3>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-wabi-earth)] mb-3">Farm to Farm</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Fresh agricultural feed and nutrition delivered directly to you.</p>
          </div>
          <div className="p-12 bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 className="text-5xl font-serif text-[var(--color-wabi-green)] mb-6 italic">T.V.M</h3>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-wabi-earth)] mb-3">Tiruvannamalai</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Sourced directly from our farms in Vandavasi.</p>
          </div>
        </div>
      </div>
      
      {/* Banner */}
      <div className="bg-[var(--color-wabi-green)] text-center py-24 px-4 relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-wabi-bg)] mb-10 relative z-10">Ready to bring health<br/><i className="text-[var(--color-wabi-gold)]">back to your farm?</i></h2>
        <Link to="/shop" className="relative z-10 inline-block bg-[var(--color-wabi-gold)] hover:bg-[#a68636] text-white px-10 py-4 font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-sm">
          Explore Our Feed
        </Link>
      </div>
    </div>
  );
}
