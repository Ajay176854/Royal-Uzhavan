import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { localApi } from '../services/localApi';
import { ArrowRight, Leaf, Wheat, Sprout } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ANIMAL_CONFIGS = {
  hen: {
    category: 'Poultry',
    title: 'Poultry Feed & Nutrition',
    tamilTitle: 'கோழி வகைகள்',
    subtitle: 'Complete Poultry Nutrition',
    description: 'Premium nutrition for all your poultry — from country hens and layers to ducks, turkeys, and broilers. Our feeds are carefully formulated with balanced grain blends, calcium boosters, and protein-rich supplements for healthy growth, strong immunity, and maximum egg production.',
    heroImage: '/images/poultry.png',
    animals: ['Hen', 'Duck', 'Turkey', 'Broiler'],
    searchQuery: 'Hen Poultry Kozhi Duck Turkey Broiler Layer Chicken',
    color: '#0B4D26',
    gradientFrom: '#0B4D26',
    gradientTo: '#1B4332',
    icon: Wheat,
    tagline: 'Egg & Growth',
    features: [
      { title: 'Layer Feed', desc: 'Optimized for maximum egg production with calcium & protein balance' },
      { title: 'Starter & Grower', desc: 'Age-specific nutrition for chicks, pullets, and growing birds' },
      { title: 'Broiler Special', desc: 'High-energy formulations for rapid, healthy weight gain' },
      { title: 'Duck & Turkey Mix', desc: 'Specialized blends tailored for waterfowl and turkey nutrition' },
    ],
  },
  cow: {
    category: 'Cattle & Animals',
    title: 'Cattle & Animal Feed',
    tamilTitle: 'பசு & மாடுகள்',
    subtitle: 'Premium Livestock Nutrition',
    description: 'High-quality feed for cows, pigs, horses, and buffaloes — formulated with high-protein pellets, mineral-rich supplements, and energy boosters to enhance milk yield, muscle growth, stamina, and overall vitality across all life stages.',
    heroImage: '/images/cattle&animals.png',
    animals: ['Cow', 'Pig', 'Horse', 'Buffalo'],
    searchQuery: 'Cow Cattle Pig Swine Horse Buffalo Dairy Livestock',
    color: '#1B4332',
    gradientFrom: '#1B4332',
    gradientTo: '#2D6A4F',
    icon: Sprout,
    tagline: 'High Protein',
    features: [
      { title: 'Dairy Cattle Feed', desc: 'Boosts milk production with essential minerals and vitamins' },
      { title: 'Pig Growth Formula', desc: 'Balanced feed for rapid, healthy weight gain and FCR optimization' },
      { title: 'Horse Nutrition', desc: 'Energy-dense feed for stamina, coat health, and performance' },
      { title: 'Buffalo Special', desc: 'Rich protein and fiber blends for strength and milk yield' },
    ],
  },
  pigeon: {
    category: 'Birds',
    title: 'Bird Feed & Seed Blends',
    tamilTitle: 'புறா & பறவைகள்',
    subtitle: 'Natural Bird Nutrition',
    description: 'Specialized seed blends, grit mixes, and vitamin supplements crafted for pigeons, love birds, African love birds, cockatiels, and conures — designed to promote vibrant plumage, peak stamina, strong bones, and overall well-being naturally.',
    heroImage: '/images/birds.png',
    animals: ['Pigeon', 'Love Birds', 'African Love Birds', 'Cockatiel', 'Conure'],
    searchQuery: 'Pigeon Bird Love Cockatiel Conure Budgie Seed Mix Parrot',
    color: '#2D6A4F',
    gradientFrom: '#2D6A4F',
    gradientTo: '#40916C',
    icon: Leaf,
    tagline: 'Natural Seeds',
    features: [
      { title: 'Racing Pigeon Blend', desc: 'High-energy seed mix for stamina, endurance, and fast recovery' },
      { title: 'Love Bird Special', desc: 'Balanced small-seed mix with vitamins for vibrant plumage' },
      { title: 'Cockatiel & Conure', desc: 'Nutrient-rich pellets and seeds for medium parrots' },
      { title: 'Grit & Minerals', desc: 'Essential calcium and mineral supplements for bone health' },
    ],
  },
  pig: {
    category: 'Cattle & Animals',
    title: 'Pig & Swine Feed',
    tamilTitle: 'பன்றி வளர்ப்பு',
    subtitle: 'Growth & Performance',
    description: 'High-quality swine feeds designed for steady growth, optimal feed conversion, and robust animal health across all stages from piglets to market weight.',
    heroImage: '/images/cattle-category.jpg',
    animals: ['Pig', 'Cow', 'Horse', 'Buffalo'],
    searchQuery: 'Pig Swine Growth Cattle',
    color: '#40916C',
    gradientFrom: '#40916C',
    gradientTo: '#52B788',
    icon: Sprout,
    tagline: 'High Protein',
    features: [
      { title: 'Starter Feed', desc: 'Specially formulated for piglets with easy-to-digest proteins' },
      { title: 'Grower Feed', desc: 'Balanced nutrition for steady, healthy weight gain' },
      { title: 'Finisher Feed', desc: 'High-energy formula for market-ready pigs' },
      { title: 'Breeding Sow', desc: 'Enhanced nutrition for reproductive health and litter quality' },
    ],
  },
};

export default function AnimalNeedPage() {
  const { animal } = useParams<{ animal: string }>();
  const navigate = useNavigate();

  const activeAnimalKey = useMemo<'cow' | 'pigeon' | 'pig' | 'hen'>(() => {
    const path = window.location.pathname.toLowerCase();
    const raw = (animal || path.replace(/^\//, '').split('/')[0] || '').toLowerCase();
    if (raw.includes('pigeon') || raw.includes('bird') || raw.includes('pura')) return 'pigeon';
    if (raw.includes('pig') || raw.includes('swine') || raw.includes('panri')) return 'pig';
    if (raw.includes('hen') || raw.includes('kozhi') || raw.includes('poultry') || raw.includes('chicken')) return 'hen';
    return 'cow';
  }, [animal]);

  const config = ANIMAL_CONFIGS[activeAnimalKey];
  const IconComponent = config.icon;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await localApi.getProducts({ limit: 200 });
        if (data && data.length > 0) {
          const filtered = data.filter((p: any) => {
            const searchTerms = config.searchQuery.toLowerCase().split(' ');
            const targetText = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
            return searchTerms.some(term => targetText.includes(term));
          });
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [config.searchQuery]);

  return (
    <div className="bg-[var(--color-wabi-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={config.heroImage}
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-12 relative z-10 pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/90">{config.category}</span>
            </div>

            {/* Category Tag */}
            <span className="inline-block text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.25em] mb-4 border-b-2 border-[var(--color-wabi-gold)]/40 pb-2">
              {config.subtitle}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3 leading-tight drop-shadow-lg">
              {config.title}
            </h1>
            <p className="text-[13px] font-extrabold text-[#0B4D26] bg-[#86B841]/90 px-3 py-1 inline-block rounded-md mb-6">{config.tamilTitle}</p>

            {/* Animal Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {config.animals.map((animalName) => (
                <span
                  key={animalName}
                  className="bg-white/15 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20"
                >
                  {animalName}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-medium">
              {config.description}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#products"
                className="bg-[var(--color-wabi-gold)] hover:bg-[#a68636] text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse {config.category} Feed
              </a>
              <Link
                to="/shop"
                className="text-white text-sm font-bold tracking-widest uppercase hover:text-[var(--color-wabi-gold)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-gold)] pb-1"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.2em] block mb-3">What We Offer</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-wabi-green)]">
              Nutrition Tailored for <span className="italic text-[var(--color-wabi-earth)]">{config.category}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {config.features.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-[var(--color-wabi-bg)] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-wabi-green)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-wabi-green)]/20 transition-colors">
                  <IconComponent className="w-5 h-5 text-[var(--color-wabi-green)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-wabi-green)] mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Products Grid */}
      <section id="products" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-[var(--color-wabi-gold)] font-bold text-xs uppercase tracking-[0.2em] block mb-2">Our Collection</span>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-wabi-green)]">
                Recommended <span className="italic text-[var(--color-wabi-earth)]">{config.category}</span> Products
              </h2>
              <p className="text-gray-500 text-sm mt-2 font-medium">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-bold text-[var(--color-wabi-green)] text-xs uppercase tracking-widest hover:text-[var(--color-wabi-earth)] transition-colors border-b border-transparent hover:border-[var(--color-wabi-earth)] pb-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[var(--color-wabi-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium text-sm">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-[var(--color-wabi-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-wabi-green)] mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto font-medium">
                We couldn't find any products for this category in our current inventory. Please check back soon!
              </p>
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-[var(--color-wabi-green)] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#1a2b14] transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-block"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Cross-Category Navigation */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-[var(--color-wabi-green)]">
              Explore Other <span className="italic text-[var(--color-wabi-earth)]">Categories</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {Object.entries(ANIMAL_CONFIGS)
              .filter(([key]) => key !== activeAnimalKey && key !== 'pig')
              .map(([key, cfg]) => (
                <Link
                  key={key}
                  to={`/${key}`}
                  className="group relative rounded-2xl overflow-hidden h-48 flex items-end p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={cfg.heroImage}
                    alt={cfg.category}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {cfg.animals.slice(0, 3).map((a) => (
                        <span key={a} className="bg-white/20 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-serif text-white font-bold">{cfg.category}</h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
