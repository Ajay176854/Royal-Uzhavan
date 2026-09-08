import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Leaf, Truck, Sprout, ArrowRight, Wheat } from 'lucide-react';
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
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newLaunches, setNewLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback products mapped from CATEGORY_DATA
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

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/products?limit=100');

        if (res.ok) {
          const data = await res.json();
          const shuffled = [...data.products].sort(() => 0.5 - Math.random());

          const uniqueProducts: any[] = [];
          const seenNames = new Set();
          for (const p of shuffled) {
            const baseName = p.name.split(' ')[0] + p.name.split(' ')[1];
            if (!seenNames.has(baseName)) {
              seenNames.add(baseName);
              uniqueProducts.push(p);
            }
          }

          const finalPool = uniqueProducts.length >= 10 ? uniqueProducts : shuffled;
          setFeaturedProducts(finalPool.slice(0, 8));
          setNewLaunches(finalPool.slice(8, 20));
        } else {
          setFeaturedProducts(mappedProducts.slice(0, 5));
          setNewLaunches(mappedProducts.slice(5, 10));
        }
      } catch (err) {
        console.error('Failed to fetch home products', err);
        setFeaturedProducts(mappedProducts.slice(0, 5));
        setNewLaunches(mappedProducts.slice(5, 10));
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center bg-[var(--color-wabi-bg)] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-wabi-bg)]/60 via-[var(--color-wabi-bg)]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col md:flex-row items-center">
          <div className="max-w-2xl w-full -mt-16 md:-mt-28">
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
      <section id="shop-by-need" className="bg-[var(--color-wabi-bg)] py-16 lg:py-24 border-y border-[var(--color-wabi-earth)]/10">
        <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-shrink-0 text-center lg:text-left max-w-sm">
            <span className="text-[#86B841] font-bold text-xs uppercase tracking-widest block mb-2">Targeted Nutrition</span>
            <h2 className="text-[var(--color-wabi-green)] font-serif text-3xl md:text-5xl leading-tight mb-4">
              Curated for<br /><i className="text-[var(--color-wabi-earth)]">Your Farm</i>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Find exactly what your livestock and poultry require for peak productivity, disease resistance, and healthy growth.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-wabi-green)] bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#86B841] animate-pulse"></span>
              Dedicated care & feeding guides
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            {[
              { 
                to: '/cow', 
                image: '/images/cattle-food.png', 
                title: 'Cow (Cattle)', 
                tamil: 'பசு & மாடுகள்', 
                desc: 'Milk & Health',
                badge: 'Dairy Special'
              },
              { 
                to: '/pigeon', 
                image: '/images/birds-food.png', 
                title: 'Pigeon', 
                tamil: 'புறா தானியங்கள்', 
                desc: 'Stamina & Grit',
                badge: 'Racing Blend'
              },
              { 
                to: '/pig', 
                image: '/images/pig-food.png', 
                title: 'Pig', 
                tamil: 'பன்றி வளர்ப்பு', 
                desc: 'Growth & FCR',
                badge: 'Fast Weight'
              },
              { 
                to: `/shop?category=${encodeURIComponent('Royal Hen Feed / Royal Kozhi Theevanam*')}`, 
                image: '/images/hen-food.png', 
                title: 'Poultry', 
                tamil: 'நாட்டுக்கோழி', 
                desc: 'Growth & Layers',
                badge: 'Egg & Broiler'
              },
              { 
                to: `/shop?category=${encodeURIComponent('Uzhavan Vittha Mattum Theevana Vagaigal')}`, 
                image: '/images/royal-seed-theevanam.png', 
                title: 'Agriculture', 
                tamil: 'விதைகள் & தவிடு', 
                desc: 'Seeds & Husks',
                badge: 'Farm Pure'
              }
            ].map((need) => (
              <Link 
                to={need.to} 
                key={need.title} 
                className="group bg-white p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#86B841] bg-[#86B841]/10 px-2 py-0.5 rounded-full mb-3">
                  {need.badge}
                </span>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center bg-[var(--color-wabi-bg)] mb-3 shadow-inner border border-gray-100 p-2 group-hover:bg-[#86B841]/10 transition-colors">
                  <img 
                    src={need.image} 
                    alt={need.title} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out" 
                  />
                </div>

                <span className="text-sm font-serif font-bold text-[var(--color-wabi-green)] group-hover:text-[#86B841] transition-colors leading-tight">
                  {need.title}
                </span>
                <span className="text-[10px] text-[var(--color-wabi-earth)] font-serif italic mb-1">
                  {need.tamil}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {need.desc}
                </span>

                <span className="mt-3 text-[10px] font-bold text-[#1B4332] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  View Feeds →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Our Animals — Highlight Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-[var(--color-wabi-bg)] via-white to-[var(--color-wabi-bg)] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--color-wabi-gold)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-wabi-green)]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 md:px-12 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-14 lg:mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.25em] mb-4 border-b-2 border-[var(--color-wabi-gold)]/30 pb-2">Our Beloved Animals</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-wabi-green)] mb-5">
              Discover Our <span className="italic text-[var(--color-wabi-earth)]">Animals</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
              We raise our animals with love, care, and the finest nutrition — ensuring they thrive in a natural, healthy environment.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Pigeon Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/pigeon"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                  <img
                    src="/images/pigeon-highlight.jpg"
                    alt="Beautiful white pigeon on a farm"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Tag */}
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                      Racing & Fancy Breeds
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-2 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Pigeons
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Graceful and intelligent — our pigeons are nurtured with premium seed blends, minerals, and grit mixes for peak stamina and vibrant plumage.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-wabi-green)]/10 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-[var(--color-wabi-green)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-wabi-green)]/70 uppercase tracking-wider">Natural Feed</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-wabi-green)] uppercase tracking-wider group-hover:text-[var(--color-wabi-earth)] transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Hen Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/hen"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-emerald-50">
                  <img
                    src="/images/hen-food.png"
                    alt="Country Hen & Poultry"
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  {/* Tag */}
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                      Nattu Kozhi & Layers
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-2 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Hens & Poultry
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Healthy and active — our country hens thrive on natural grain blends, chick starters, and shell calcium for high egg yield and strong immunity.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-wabi-green)]/10 flex items-center justify-center">
                        <Wheat className="w-4 h-4 text-[var(--color-wabi-green)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-wabi-green)]/70 uppercase tracking-wider">Egg Booster</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-wabi-green)] uppercase tracking-wider group-hover:text-[var(--color-wabi-earth)] transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Pig Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/pig"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                  <img
                    src="/images/pig-highlight.jpg"
                    alt="Healthy pig in a green farmyard"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  {/* Tag */}
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                      Growth & Nutrition
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-2 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Pigs
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Strong and thriving — our pigs are raised on balanced, high-protein feeds crafted for rapid, healthy growth and optimal feed conversion.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-wabi-green)]/10 flex items-center justify-center">
                        <Sprout className="w-4 h-4 text-[var(--color-wabi-green)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-wabi-green)]/70 uppercase tracking-wider">High Protein</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-wabi-green)] uppercase tracking-wider group-hover:text-[var(--color-wabi-earth)] transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
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
                onSlideClick={(slide) => slide.link && navigate(slide.link)}
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
      {!loading && newLaunches.length > 0 && (
        <section className="py-24 relative border-t border-[var(--color-wabi-earth)]/10 overflow-hidden">
          {/* Farm Field Background */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/farm-field-bg.jpg")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/40 via-[#1a3a1a]/20 to-[#f5f0e8]/40"></div>

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
