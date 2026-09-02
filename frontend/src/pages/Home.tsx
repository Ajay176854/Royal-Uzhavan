import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Leaf, Truck, Sprout, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Smooth3DSlideshow from '../components/Smooth3DSlideshow';
import CoverflowCarousel from '../components/CoverflowCarousel';

export default function Home() {
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newLaunches, setNewLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured/popular
        const featuredRes = await fetch('http://localhost:8000/api/products?sort=popular&limit=6');
        const newRes = await fetch('http://localhost:8000/api/products?sort=created_at&limit=6');
        
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setFeaturedProducts(featuredData.products);
        }
        if (newRes.ok) {
          const newData = await newRes.json();
          setNewLaunches(newData.products);
        }
      } catch (err) {
        console.error('Failed to fetch home products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center bg-[var(--color-wabi-bg)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1596733430284-f74372763f03?auto=format&fit=crop&q=80&w=2000"
            alt="Farm Landscape"
            className="w-full h-full object-cover sepia-[0.2] contrast-[0.95]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-wabi-bg)] via-[var(--color-wabi-bg)]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col md:flex-row items-center">
          <div className="max-w-2xl w-full">
            <span className="text-[var(--color-wabi-green)] font-bold tracking-[0.2em] text-xs uppercase mb-6 block border-l-2 border-[var(--color-wabi-gold)] pl-4">ESTD 1984 — TAMIL NADU</span>
            <h1 className="text-[var(--color-wabi-green)] text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] mb-6">
              Farm Fresh,<br />Grow with <span className="italic text-[var(--color-wabi-earth)]">Nature.</span>
            </h1>
            <p className="text-gray-700 max-w-lg text-sm md:text-base mb-10 font-medium leading-relaxed">
              Premium traditional rice, cold-pressed oils, fresh organic vegetables, and natural farm essentials. Direct from our heritage farms in Vandavasi to your doorstep.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/shop" className="bg-[var(--color-wabi-green)] hover:bg-[#1a2b14] text-white px-10 py-4 font-bold text-xs uppercase tracking-widest rounded-full transition-all">
                Shop Produce
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
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-4">Our Harvest</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Cultivated with care, harvested by hand. Explore our categories of natural produce.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 'I', title: 'Traditional Rice', desc: 'Mapillai Samba, Karuppu Kavuni, and more authentic grains.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600' },
              { num: 'II', title: 'Cold Pressed Oils', desc: 'Wood pressed groundnut, sesame, and coconut oils.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600' },
              { num: 'III', title: 'Organic Vegetables', desc: 'Farm-fresh veggies and native greens harvested daily.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600' },
              { num: 'IV', title: 'Ghee & Honey', desc: 'Pure desi cow ghee and raw, unprocessed forest honey.', image: 'https://images.unsplash.com/photo-1647427022241-11c52dcd0000?auto=format&fit=crop&q=80&w=600' }
            ].map((item, i) => (
              <Link to={`/shop?category=${encodeURIComponent(item.title)}`} key={item.num} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-[var(--color-wabi-bg)] relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover sepia-[0.1] contrast-100 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm text-[var(--color-wabi-earth)]">
                    {item.num}
                  </div>
                </div>
                <h3 className="text-lg font-serif text-[var(--color-wabi-green)] mb-2 group-hover:text-[var(--color-wabi-earth)] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px]">{item.desc}</p>
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
              Curated for<br /><i className="text-[var(--color-wabi-earth)]">Your Needs</i>
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto lg:mx-0">Find exactly what your kitchen requires for a wholesome, natural diet.</p>
          </div>
          <div className="flex-1 flex flex-wrap justify-center lg:justify-start gap-4 w-full">
            {[
              { icon: '🍚', title: 'Daily Meals', desc: 'Native rice varieties' },
              { icon: '🍳', title: 'Healthy Cooking', desc: 'Unrefined oils' },
              { icon: '🌿', title: 'Fresh Greens', desc: 'Daily Keerai' },
              { icon: '🍯', title: 'Immunity Boost', desc: 'Pure Ghee & Honey' }
            ].map((need, i) => (
              <Link to={`/shop?need=${encodeURIComponent(need.title)}`} key={need.title} className="w-[calc(50%-8px)] md:w-[220px] bg-white p-6 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[var(--color-wabi-bg)] mb-4">
                  {need.icon}
                </div>
                <span className="text-sm font-serif text-[var(--color-wabi-green)] mb-1">{need.title}</span>
                <span className="text-xs text-gray-500">{need.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-24 relative border-t border-[var(--color-wabi-earth)]/10 overflow-hidden">
          {/* Premium Blurred Background */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-[12px] scale-110 opacity-[0.85]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541857754-05db42ebafdd?auto=format&fit=crop&q=80&w=2000")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white/70 backdrop-blur-[2px]"></div>

          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-wabi-green)] mb-3">Featured Produce</h2>
                <p className="text-gray-500 text-sm">Hand-selected favorites from our harvest.</p>
              </div>
              <Link to="/shop" className="hidden md:inline-flex items-center gap-2 font-bold text-[var(--color-wabi-green)] text-xs uppercase tracking-widest hover:text-[var(--color-wabi-earth)] transition-colors mt-4 md:mt-0 border-b border-transparent hover:border-[var(--color-wabi-earth)] pb-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full h-[500px] mb-8">
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
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[var(--color-wabi-bg)] text-[var(--color-wabi-green)] font-bold px-8 py-4 rounded-full text-sm">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Launches — Coverflow Carousel */}
      {!loading && newLaunches.length > 0 && (
        <section className="py-24 relative border-t border-[var(--color-wabi-earth)]/10 overflow-hidden">
          {/* Premium Blurred Background */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-[12px] scale-110 opacity-[0.85]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2000")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-wabi-bg)]/30 via-transparent to-[var(--color-wabi-bg)]/30 backdrop-blur-[2px]"></div>

          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-wabi-green)]">New Arrivals</h2>
                <p className="text-gray-700 font-medium text-sm mt-2">Freshly added to our collection — swipe to explore.</p>
              </div>
              <Link to="/shop" className="hidden md:inline-flex items-center gap-2 font-bold text-[var(--color-wabi-green)] text-xs uppercase tracking-widest hover:text-[var(--color-wabi-earth)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-earth)] pb-1">
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full h-[480px]">
              <CoverflowCarousel
                products={newLaunches}
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
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-[var(--color-wabi-green)] py-24 text-center px-4 relative overflow-hidden">
        {/* Soft background texture element */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-wabi-gold) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto max-w-2xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-wabi-bg)] mb-6">Join Our Community</h2>
          <p className="text-[var(--color-wabi-bg)]/80 mb-10 font-medium max-w-lg mx-auto leading-relaxed">Subscribe to receive seasonal harvest updates, authentic recipes, and exclusive community discounts.</p>
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
