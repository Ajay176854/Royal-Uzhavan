import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Leaf, Truck, Sprout, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import Smooth3DSlideshow from '../components/Smooth3DSlideshow';
import CoverflowCarousel from '../components/CoverflowCarousel';

const CATEGORY_DATA = [
  { num: 'I', title: 'Royal Cattle Feed', desc: 'Premium feeds and mixes for healthy, productive cattle.', image: '/images/cattle-food.png', price: 850 },
  { num: 'II', title: 'Royal Hen Feed', desc: 'Starter, grower, and layer feeds for healthy hens.', image: '/images/hen-food.png', price: 650 },
  { num: 'III', title: 'Royal Birds Food', desc: 'Specialized mixes for pigeons, budgies, and exotic birds.', image: '/images/birds-food.png', price: 450 },
  { num: 'IV', title: 'Oil Cake (Punnakku)', desc: 'High-protein seed meals for optimal digestion and condition.', image: '/images/royal-punnakku.png', price: 1200 },
  { num: 'V', title: 'Farmer\'s Bran Types', desc: 'Essential daily nutrition and dietary fiber for livestock.', image: '/images/royal-nutrition.png', price: 550 },
  { num: 'VI', title: 'Oil Seeds & Millets', desc: 'Premium multi-grain seed & pulse blend for birds.', image: '/images/royal-grains.png', price: 750 },
  { num: 'VII', title: 'Cereals, Millets & Grains', desc: 'Complete mix of essential grains for optimal nutrition.', image: '/images/royal-cereals.jpg', price: 900 },
  { num: 'VIII', title: 'Cattle Feed & Seed Cake', desc: 'Balanced feed pellets and seed mixes for all stages.', image: '/images/royal-seed-theevanam.png', price: 1100 },
  { num: 'IX', title: 'Pulses Husk & Feed Waste', desc: 'Traditional multi-bran mix for maximum digestive aid.', image: '/images/royal-thoosu-vagaigal.jpg', price: 350 },
  { num: 'X', title: 'Pigeon Health Supplements', desc: 'Calcium, grit, and tonics for optimal animal health.', image: '/images/hen-pigeon-supplement.png', price: 250 }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);

  const mappedProducts = CATEGORY_DATA.map((item, index) => ({
    id: String(index + 1),
    name: item.title,
    price: item.price,
    image: item.image,
    category: item.title,
    tags: ["Best Seller"],
    rating: 5,
    reviews: 0,
    variants: [],
    in_stock: true,
  }));

  const featuredProducts = mappedProducts.slice(0, 5);
  const newLaunches = mappedProducts.slice(5, 10);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center bg-[var(--color-wabi-bg)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted={true}
            defaultMuted={true}
            playsInline={true}
            className="w-full h-full object-cover object-top"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-wabi-bg)]/90 via-[var(--color-wabi-bg)]/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col md:flex-row items-center">
          <div className="max-w-2xl w-full">
            <span className="text-[var(--color-wabi-green)] font-bold tracking-[0.2em] text-xs uppercase mb-6 block border-l-2 border-[var(--color-wabi-gold)] pl-4">ROYAL UZHAVAN — ANIMAL NUTRITION</span>
            <h1 className="text-[var(--color-wabi-green)] text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] mb-6">
              Quality Feed,<br />Healthy <span className="italic text-[var(--color-wabi-earth)]">Animals.</span>
            </h1>
            <p className="text-gray-700 max-w-lg text-sm md:text-base mb-10 font-medium leading-relaxed">
              Royal Uzhavan is a homegrown agricultural and animal nutrition company producing reliable feed for farmers, livestock, poultry, and birds. Premium quality for sustainable farming.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/shop" className="bg-[var(--color-wabi-green)] hover:bg-[#1a2b14] text-white px-10 py-4 font-bold text-xs uppercase tracking-widest rounded-full transition-all">
                Shop Products
              </Link>
              <Link to="/our-farms" className="text-[var(--color-wabi-green)] text-sm font-bold tracking-widest uppercase hover:text-[var(--color-wabi-gold)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-gold)] pb-1">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Floating trust badges - softer approach */}
        <div className="hidden lg:flex absolute bottom-12 right-12 gap-16 z-20 bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white">
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-wabi-earth)] text-2xl font-serif italic mb-1">100%</span>
            <span className="text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest">Organic Base</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-wabi-earth)] text-2xl font-serif italic mb-1">24hr</span>
            <span className="text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest">Farm to Door</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-wabi-earth)] text-2xl font-serif italic mb-1">4th Gen</span>
            <span className="text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest">Farmers Led</span>
          </div>
        </div>
      </section>

      {/* Category Editorial Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="mb-16 text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-4">Our Products</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Carefully formulated nutrition for all your farming and livestock needs.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8">
            {CATEGORY_DATA.map((item, i) => (
              <Link to={`/shop?category=${encodeURIComponent(item.title)}`} key={item.num} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-[var(--color-wabi-bg)] relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover sepia-[0.1] contrast-100 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm text-[var(--color-wabi-earth)] shadow-sm">
                    {item.num}
                  </div>
                </div>
                <h3 className="text-base font-bold font-serif text-[var(--color-wabi-green)] mb-2 group-hover:text-[var(--color-wabi-earth)] transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px] line-clamp-2">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Need - Softened */}
      <section className="bg-[var(--color-wabi-bg)] py-16 lg:py-24 border-y border-[var(--color-wabi-earth)]/10">
        <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-shrink-0 text-center lg:text-left">
            <h2 className="text-[var(--color-wabi-green)] font-serif text-3xl md:text-5xl leading-tight mb-4">
              Curated for<br /><i className="text-[var(--color-wabi-earth)]">Your Farm</i>
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto lg:mx-0">Find exactly what your livestock and poultry require for healthy growth.</p>
          </div>
          <div className="flex-1 flex flex-wrap justify-center lg:justify-start gap-4 w-full">
            {[
              { image: '/images/cattle-food.png', title: 'Cattle', desc: 'Milk & Health' },
              { image: '/images/hen-food.png', title: 'Poultry', desc: 'Growth & Layers' },
              { image: '/images/birds-food.png', title: 'Birds', desc: 'Pigeon & Exotic' },
              { image: '/images/royal-seed-theevanam.png', title: 'Agriculture', desc: 'Seeds & Husks' }
            ].map((need, i) => (
              <Link to={`/shop?need=${encodeURIComponent(need.title)}`} key={need.title} className="w-[calc(50%-8px)] md:w-[220px] bg-white p-6 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-[var(--color-wabi-bg)] mb-4 shadow-sm border border-gray-100">
                  <img src={need.image} alt={need.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-serif text-[var(--color-wabi-green)] mb-1">{need.title}</span>
                <span className="text-xs text-gray-500">{need.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 relative border-t border-[var(--color-wabi-earth)]/10 overflow-hidden">
          {/* Natural Greenery Background */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-100 contrast-125 saturate-110"
            style={{ backgroundImage: 'url("/nature-bg.jpg")' }}
          ></div>
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-3 drop-shadow-md">Featured Products</h2>
                <p className="text-white/90 text-sm drop-shadow-md">Top recommendations for your livestock and poultry.</p>
              </div>
              <Link to="/shop" className="hidden md:inline-flex items-center gap-2 font-bold text-white text-xs uppercase tracking-widest hover:text-gray-200 transition-colors mt-4 md:mt-0 border-b border-transparent hover:border-white pb-1 drop-shadow-md">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full h-[500px] mb-8"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Smooth3DSlideshow 
                slides={featuredProducts.map(p => ({
                  image: { src: p.image, alt: p.name },
                  title: p.name + '\n₹' + p.price,
                  link: `/product/${p.id}`
                }))}
                cardWidth={350}
                cardHeight={450}
                radius={10}
                autoplay={true}
                onSlideChange={setActiveFeaturedIndex}
                titleFont={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "24px",
                  lineHeight: "1.2",
                }}
              />
            </motion.div>
            
            <motion.div
              className="mt-12 text-center md:hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[var(--color-wabi-bg)] text-[var(--color-wabi-green)] font-bold px-8 py-4 rounded-full text-sm">
                View All Products
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* New Launches — Coverflow Carousel */}
      {newLaunches.length > 0 && (
        <section className="py-24 relative border-t border-[var(--color-wabi-earth)]/10 overflow-hidden">
          {/* Premium Blurred Background */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-[12px] scale-110 opacity-[0.85]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2000")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-wabi-bg)]/30 via-transparent to-[var(--color-wabi-bg)]/30 backdrop-blur-[2px]"></div>

          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <motion.div
              className="flex items-end justify-between mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-wabi-green)]">New Arrivals</h2>
                <p className="text-gray-700 font-medium text-sm mt-2">Freshly added to our collection — swipe to explore.</p>
              </div>
              <Link to="/shop" className="hidden md:inline-flex items-center gap-2 font-bold text-[var(--color-wabi-green)] text-xs uppercase tracking-widest hover:text-[var(--color-wabi-earth)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-earth)] pb-1">
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              className="w-full h-[480px]"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <CoverflowCarousel
                products={newLaunches}
                onProductClick={(product) => navigate(`/product/${product.id}`)}
                activeWidth={420}
                activeHeight={400}
                restWidth={140}
                restHeight={260}
                gap={24}
                radius={4}
                showArrows={true}
                autoplay={true}
                autoplayDirection="leftToRight"
                transition={{ duration: 0.3, delay: 2.5 }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-[var(--color-wabi-green)] py-24 text-center px-4 relative overflow-hidden">
        {/* Soft background texture element */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-wabi-gold) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto max-w-2xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-wabi-bg)] mb-6">Join Our Farmer Community</h2>
          <p className="text-[var(--color-wabi-bg)]/80 mb-10 font-medium max-w-lg mx-auto leading-relaxed">Subscribe to receive agricultural updates, feed guidelines, and exclusive community discounts.</p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-l-full sm:rounded-r-none rounded-r-full mb-3 sm:mb-0 bg-[var(--color-wabi-bg)] focus:outline-none text-[var(--color-wabi-green)] placeholder:text-[var(--color-wabi-green)]/40"
              required
            />
            <button type="submit" className="bg-[var(--color-wabi-gold)] hover:bg-[#a68636] text-white font-bold px-8 py-4 rounded-r-full sm:rounded-l-none rounded-l-full transition-colors whitespace-nowrap text-xs uppercase tracking-widest">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function User(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
