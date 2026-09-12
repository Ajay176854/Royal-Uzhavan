import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { localApi } from '../services/localApi';
import { ShieldCheck, Leaf, Truck, Sprout, ArrowRight, Wheat } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import Smooth3DSlideshow from '../components/Smooth3DSlideshow';
import CoverflowCarousel from '../components/CoverflowCarousel';

const PRODUCT_CATEGORIES = {
  'Feed': [
    { title: 'Royal Cattle Feed', tamil: 'பசு தீவனம்', to: '/cow', desc: 'Premium feeds and mixes for cattle.', image: '/images/cattle-food.png' },
    { title: 'Royal Hen Feed', tamil: 'கோழி தீவனம்', to: '/hen', desc: 'Starter, grower, and layer feeds for hens.', image: '/images/hen-food.png' },
    { title: 'Royal Birds Food', tamil: 'பறவைகள் உணவு', to: '/pigeon', desc: 'Specialized mixes for pigeons and birds.', image: '/images/birds-food.png' },
    { title: 'Pig Feed', tamil: 'பன்றி தீவனம்', to: '/pig', desc: 'High quality feed for pigs.', image: '/images/pig.jpeg' },
    { title: 'Horse Feed', tamil: 'குதிரை தீவனம்', to: '/cow', desc: 'Nutritious feed for horses.', image: '/images/horse.jpg' },
  ],
  'Supplements & Accessories': [
    { title: 'Birds', tamil: 'பறவைகள்', to: '/shop?category=Hen%20and%20Pigeon%20Supplements', desc: 'Calcium, grit, and tonics for optimal bird health.', image: '/images/Pegion.jpeg' },
    { title: 'Cattle / Animals', tamil: 'மாடு / விலங்குகள்', to: '/shop?category=Royal%20Cattle%20Feed', desc: 'Mineral mixtures and health supplements for cattle.', image: '/images/cattle-food.png' },
    { title: 'Hen / Poultry', tamil: 'கோழி', to: '/shop?category=Hen%20and%20Pigeon%20Supplements', desc: 'Vitamins and boosters for hens and poultry.', image: '/images/Hen.jpeg' },
  ],

  'Other': [
    { title: 'Oil Cake (Punnakku)', tamil: 'எண்ணெய் பிண்ணாக்கு', to: '/shop?category=Royal%20oil-cake(Punnaku)', desc: 'High-protein seed meals for optimal digestion and condition.', image: '/images/royal-punnakku.png' },
    { title: 'Farmer\'s Bran Types', tamil: 'விவசாயிகளின் தவிடு வகைகள்', to: '/shop?category=Uzhavan%20Thavitu%20Vagaigal%20-%20nutrition', desc: 'Essential daily nutrition and dietary fiber for livestock.', image: '/images/royal-nutrition.png' },
    { title: 'Pulses Husk & Feed Waste', tamil: 'பருப்பு உமி & தீவனக் கழிவு', to: '/shop?category=Uzhavan%20Thusi%20Vagaigal', desc: 'Traditional multi-bran mix for maximum digestive aid.', image: '/images/royal-thoosu-vagaigal.jpg' },
  ],
};

export default function Home() {
  const navigate = useNavigate();
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<keyof typeof PRODUCT_CATEGORIES>('Feed');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newLaunches, setNewLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Fallback products mapped from PRODUCT_CATEGORIES
  const mappedProducts = PRODUCT_CATEGORIES['Feed'].map((item, index) => ({
    id: String(index + 1),
    name: item.title,
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
        const [data, settingsData] = await Promise.all([
          localApi.getProducts({ limit: 200 }),
          localApi.getSettings()
        ]);
        setSiteSettings(settingsData);

        if (data && data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());

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
            <source src="/theme_video.MP4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-wabi-bg)]/40 via-[var(--color-wabi-bg)]/10 to-transparent"></div>
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
            <span className="inline-block text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.25em] mb-4 border-b-2 border-[var(--color-wabi-gold)]/30 pb-2">Nutrition For Every Animal</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-wabi-green)] mb-5">
              Feed for Every <span className="italic text-[var(--color-wabi-earth)]">Animal</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
              Premium, carefully crafted nutrition for pigeons, poultry, and pigs — formulated to boost health, growth, and productivity naturally.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Poultry Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/hen"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                  <img
                    src="/images/poultry.png"
                    alt="Poultry — Hen, Duck, Turkey & Broiler"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  {/* Tag */}
                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-1.5">
                    {['Hen', 'Duck', 'Turkey', 'Broiler'].map((animal) => (
                      <span key={animal} className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-1 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Poultry
                  </h3>
                  <p className="text-[13px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2.5 py-0.5 inline-block rounded-md mb-3">நாட்டுக்கோழி</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Complete nutrition for hens, ducks, turkeys, and broilers — balanced grain blends, calcium boosters, and layer feeds for healthy growth and maximum egg production.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-wabi-green)]/10 flex items-center justify-center">
                        <Wheat className="w-4 h-4 text-[var(--color-wabi-green)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-wabi-green)]/70 uppercase tracking-wider">Egg & Growth</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-wabi-green)] uppercase tracking-wider group-hover:text-[var(--color-wabi-earth)] transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Cattle & Animals Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/cow"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                  <img
                    src="/images/cattle&animals.png"
                    alt="Cattle & Animals — Cow, Pig, Horse & Buffalo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  {/* Tag */}
                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-1.5">
                    {['Cow', 'Pig', 'Horse', 'Buffalo'].map((animal) => (
                      <span key={animal} className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-1 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Cattle & Animals
                  </h3>
                  <p className="text-[13px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2.5 py-0.5 inline-block rounded-md mb-3">மாடு & விலங்குகள்</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Premium feed for cows, pigs, horses, and buffaloes — high-protein pellets, mineral-rich supplements, and energy boosters for milk yield, muscle growth, and vitality.
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

            {/* Birds Card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/pigeon"
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(43,69,34,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                  <img
                    src="/images/birds.png"
                    alt="Birds — Pigeon, Love Birds, Cockatiel & Conure"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  {/* Tags */}
                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-1.5 max-w-[90%]">
                    {['Pigeon', 'Love Birds', 'Cockatiel', 'Conure'].map((bird) => (
                      <span key={bird} className="bg-white/90 backdrop-blur-md text-[var(--color-wabi-green)] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {bird}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <h3 className="text-2xl font-serif text-[var(--color-wabi-green)] mb-1 group-hover:text-[var(--color-wabi-earth)] transition-colors duration-300">
                    Birds
                  </h3>
                  <p className="text-[13px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2.5 py-0.5 inline-block rounded-md mb-3">பறவைகள்</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
                    Specialized seed blends for pigeons, love birds, African love birds, cockatiels, and conures — crafted with natural grains, grit, and vitamins for vibrant plumage and stamina.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-wabi-green)]/10 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-[var(--color-wabi-green)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-wabi-green)]/70 uppercase tracking-wider">Natural Seeds</span>
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
                image: '/images/Pegion.jpeg',
                title: 'Pigeon',
                tamil: 'புறா தானியங்கள்',
                desc: 'Stamina & Grit',
                badge: 'Racing Blend'
              },
              {
                to: '/pig',
                image: '/images/pig.jpeg',
                title: 'Pig',
                tamil: 'பன்றி வளர்ப்பு',
                desc: 'Growth & FCR',
                badge: 'Fast Weight'
              },
              {
                to: '/hen',
                image: '/images/hen-food.png',
                title: 'Poultry',
                tamil: 'கோழி',
                desc: 'Balanced feed for egg laying hens.',
                badge: 'Layer'
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
                className="group bg-white p-5 sm:p-6 lg:p-8 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#86B841] bg-[#86B841]/10 px-3 py-1 rounded-full mb-4">
                  {need.badge}
                </span>

                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[1.5rem] overflow-hidden flex items-center justify-center bg-[var(--color-wabi-bg)] mb-4 shadow-inner border border-gray-100 p-3 group-hover:bg-[#86B841]/10 transition-colors">
                  <img
                    src={need.image}
                    alt={need.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                <span className="text-base sm:text-lg lg:text-xl font-serif font-bold text-[var(--color-wabi-green)] group-hover:text-[#86B841] transition-colors leading-tight mb-1">
                  {need.title}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2 py-1 inline-block rounded-md mb-2">
                  {need.tamil}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
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

      {/* Category Editorial Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-4">Our Products</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">Carefully formulated nutrition for all your farming and livestock needs.</p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
              {Object.keys(PRODUCT_CATEGORIES).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as keyof typeof PRODUCT_CATEGORIES)}
                    className={`relative px-5 py-2.5 text-xs md:text-sm font-bold tracking-widest uppercase rounded-full transition-colors duration-300 ${isActive
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[var(--color-wabi-green)] rounded-full shadow-md"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeTab}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8"
          >
            {PRODUCT_CATEGORIES[activeTab].map((item, i) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
              >
                <Link to={item.to || `/shop?category=${encodeURIComponent(item.title)}`} className="group flex flex-col items-center text-center">
                  <div className="w-full aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-[var(--color-wabi-bg)] relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover sepia-[0.1] contrast-100 group-hover:scale-105 transition-transform duration-700 ease-out" />
                    {item.num && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm text-[var(--color-wabi-earth)] shadow-sm">
                        {item.num}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold font-serif text-[var(--color-wabi-green)] mb-1 group-hover:text-[var(--color-wabi-earth)] transition-colors line-clamp-1">{item.title}</h3>
                  {item.tamil && <p className="text-[11px] font-extrabold text-[#0B4D26] bg-[#86B841]/20 px-2 py-0.5 inline-block rounded-md mb-2 mt-1">{item.tamil}</p>}
                  <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px] line-clamp-2">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
                  title: p.name + (p.name_tamil ? '\n' + p.name_tamil : ''),
                  link: `/shop?category=${encodeURIComponent(p.category)}`
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

      {/* Bestselling Products Highlight */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 lg:py-24 bg-[var(--color-wabi-bg)] border-y border-[var(--color-wabi-earth)]/10">
          <div className="container mx-auto px-4 md:px-12">
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <span className="text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.25em] block mb-3 border-b-2 border-[var(--color-wabi-gold)]/30 pb-2 w-fit">Customer Favourites</span>
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-wabi-green)]">
                  Our <span className="italic text-[var(--color-wabi-earth)]">Bestsellers</span>
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">Top-rated products loved by farmers and livestock owners.</p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 font-bold text-[var(--color-wabi-green)] text-xs uppercase tracking-widest hover:text-[var(--color-wabi-earth)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-earth)] pb-1"
              >
                Shop All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {featuredProducts.slice(0, 8).map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile CTA */}
            <motion.div
              className="mt-10 text-center md:hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[var(--color-wabi-green)] text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Royal Uzhavan */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-wabi-gold)]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-wabi-green)]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 md:px-12 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.25em] mb-4 border-b-2 border-[var(--color-wabi-gold)]/30 pb-2">Trusted by Farmers</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-wabi-green)] mb-5">
              Why Choose <span className="italic text-[var(--color-wabi-earth)]">Royal Uzhavan?</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
              From our farms to yours — we deliver premium, naturally crafted animal nutrition trusted by hundreds of farmers across Tamil Nadu.
            </p>
          </motion.div>

          {/* Stats Counter Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { value: '500+', label: 'Happy Farmers', sublabel: 'Across Tamil Nadu' },
              { value: '100+', label: 'Feed Products', sublabel: 'For Every Animal' },
              { value: '100%', label: 'Natural', sublabel: 'No Harmful Additives' },
              { value: 'Free', label: 'Shipping', sublabel: 'All Over Kanyakumari' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-[var(--color-wabi-bg)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-wabi-green)] mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-[var(--color-wabi-green)]/80 mb-0.5">{stat.label}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-16">
            {[
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                desc: 'Every batch is tested for purity, protein content, and nutritional balance before reaching your farm.',
                accent: '#0B4D26',
              },
              {
                icon: Leaf,
                title: '100% Natural Ingredients',
                desc: 'We source grains, seeds, and supplements from trusted local farmers — no chemicals, no fillers.',
                accent: '#86B841',
              },
              {
                icon: Truck,
                title: 'Fast Farm Delivery',
                desc: 'Direct doorstep delivery across Tamil Nadu. Bulk orders ship free with priority handling.',
                accent: '#B8860B',
              },
              {
                icon: Sprout,
                title: 'Expert Feeding Guides',
                desc: 'Get free nutrition advice from our team — tailored feeding plans for every stage of your animal\'s life.',
                accent: '#2D6A4F',
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-[var(--color-wabi-bg)] rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover accent line */}
                <div
                  className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: benefit.accent }}
                ></div>

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                  style={{ backgroundColor: `${benefit.accent}15` }}
                >
                  <benefit.icon className="w-6 h-6" style={{ color: benefit.accent }} />
                </div>
                <h3 className="text-base font-bold text-[var(--color-wabi-green)] mb-2 font-serif">{benefit.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bulk Order CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-wabi-green)] via-[#1B4332] to-[#2D6A4F]"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-wabi-gold) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">Need Bulk Orders?</h3>
                <p className="text-white/70 text-sm font-medium max-w-lg">
                  Get special wholesale pricing for farms, poultry units, and livestock businesses. Free shipping on orders above ₹5,000.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="bg-[var(--color-wabi-gold)] hover:bg-[#a68636] text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap text-center"
                >
                  Get Quote
                </Link>
                <a
                  href={siteSettings?.whatsapp_link || "https://wa.me/919876543210"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest rounded-full transition-all border border-white/20 whitespace-nowrap text-center"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Community */}
      <section className="bg-[var(--color-wabi-green)] py-24 text-center px-4 relative overflow-hidden">
        {/* Soft background texture element */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-wabi-gold) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto max-w-2xl relative z-10">
          <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,211,102,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-wabi-bg)] mb-6">Join Our Farmer Community</h2>
          <p className="text-[var(--color-wabi-bg)]/80 mb-10 font-medium max-w-lg mx-auto leading-relaxed">Join our exclusive WhatsApp group to get daily agricultural updates, seasonal feeding guidelines, direct support, and community-only wholesale offers.</p>
          <a href={siteSettings?.whatsapp_link || "https://wa.me/919876543210"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[var(--color-wabi-gold)] hover:bg-[#a68636] text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap text-xs uppercase tracking-widest mx-auto">
            Join the Group Now
          </a>
        </div>
      </section>
    </div>
  );
}

function User(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
