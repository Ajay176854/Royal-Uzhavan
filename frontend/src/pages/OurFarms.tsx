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
          <span className="text-[var(--color-wabi-gold)] font-bold tracking-[0.3em] text-[10px] uppercase mb-6 block">ESTD 2021</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8">Our Farming Heritage</h1>
          <p className="text-lg text-[var(--color-wabi-bg)]/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Rooted in Kurunthancode, Nagercoil, Kanyakumari District. Royal Uzhavan is dedicated to producing and supplying reliable nutrition and feed for farmers, livestock, and poultry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="rounded-3xl overflow-hidden shadow-sm bg-[var(--color-wabi-earth)]/10 p-4">
            <img src="/images/our-story.jpg" alt="Our Journey" className="w-full h-full object-cover aspect-[4/3] rounded-2xl sepia-[0.15] contrast-95" />
          </div>
          <div>
            <span className="text-[var(--color-wabi-earth)] font-serif italic text-lg mb-4 block">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-8 leading-tight">Built by Hard Work, Perfected for Your Animals</h2>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="mb-6 leading-relaxed">
                In 2020, we started small right from home, setting up a farm—a bird farm. We bought bird feed from outside, used it, and shared it with people around us. From there, taking the next step, we bought cattle feed, stocked it at home, and began supplying it. For deliveries, we used the Swift car we had at home, eventually getting scolded by family for it.
              </p>
              <p className="leading-relaxed">
                Deciding to move on to the next phase, we opened a shop, worked hard there, lifted and loaded feed sacks, and delivered them—hauling three or four sacks at a time on small scooters. Gradually, step by step, we opened another branch, established a company, and grown to the level where we now manufacture and supply our own brand of feed from our very own company today. That's the journey.
              </p>
            </div>
          </div>
        </div>

        {/* Second Block: Text Left, Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="order-2 md:order-1">
            <span className="text-[var(--color-wabi-earth)] font-serif italic text-lg mb-4 block">Branch 1</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-8 leading-tight">From Our First Shop<br />To a Growing Success.</h2>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="mb-6 leading-relaxed">
                What began as a small vision to provide quality animal feed became the first step in our journey.
              </p>
              <p className="mb-6 leading-relaxed">
                Our first shop brought us closer to farmers, helping us understand their needs and earn their trust through quality products and reliable service.
              </p>
              <p className="leading-relaxed">
                That first shop became the foundation of our success and the beginning of something much bigger.
              </p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm bg-[var(--color-wabi-green)]/10 p-4 order-1 md:order-2">
            <img src="/images/nature-bg.jpg" alt="Our Mission" className="w-full h-full object-cover aspect-[4/3] rounded-2xl sepia-[0.15] contrast-95" />
          </div>
        </div>

        {/* Third Block: Image Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="rounded-3xl overflow-hidden shadow-sm bg-[var(--color-wabi-gold)]/10 p-4">
            <img src="/farm-field-bg.jpg" alt="Our Promise" className="w-full h-full object-cover aspect-[4/3] rounded-2xl sepia-[0.15] contrast-95" />
          </div>
          <div>
            <span className="text-[var(--color-wabi-earth)] font-serif italic text-lg mb-4 block">Branch 2</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-8 leading-tight">A New Branch,<br />A Bigger Journey</h2>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="mb-6 leading-relaxed">
                In 2025, the success and trust built through our first shop gave us the confidence to take the next step.
              </p>
              <p className="mb-6 leading-relaxed">
                Our second branch marked a new chapter in our journey, bringing the same quality animal feed and trusted service to more farmers.
              </p>
              <p className="leading-relaxed">
                From one shop to two, every step is driven by the trust of our customers and our commitment to their livestock.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mb-32 max-w-4xl mx-auto">
          <div className="p-12 bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 className="text-5xl font-serif text-[var(--color-wabi-green)] mb-6 italic">100%</h3>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-wabi-earth)] mb-3">Natural</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Committed to chemical-free, high-quality agricultural practices.</p>
          </div>
          <div className="p-12 bg-white rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <h3 className="text-5xl font-serif text-[var(--color-wabi-green)] mb-6 italic">KK</h3>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-wabi-earth)] mb-3">Kanyakumari</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Sourced directly from our farms in Nagercoil.</p>
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
