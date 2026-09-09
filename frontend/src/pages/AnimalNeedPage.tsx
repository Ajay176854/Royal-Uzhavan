import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ANIMAL_CONFIGS = {
  cow: {
    title: 'Cow & Cattle Feeds (பசு)',
    description: 'Premium feeds for optimal cattle health, milk production, and overall well-being.',
    heroImage: '/images/cattle-food.png',
    searchQuery: 'Cow',
    color: '#0B4D26',
  },
  pigeon: {
    title: 'Pigeon & Bird Mix (புறா)',
    description: 'Specialized mixes and seeds for pigeons, exotic birds, and budgies.',
    heroImage: '/images/birds-food.png',
    searchQuery: 'Pigeon',
    color: '#1B4332',
  },
  hen: {
    title: 'Hen & Kozhi Feed (கோழி)',
    description: 'Starter, grower, and layer feeds for healthy hens and poultry.',
    heroImage: '/images/hen-food.png',
    searchQuery: 'Hen',
    color: '#2D6A4F',
  },
  pig: {
    title: 'Pig & Swine Growth (பன்றி)',
    description: 'High-quality swine feeds designed for steady growth and animal health.',
    heroImage: '/images/royal-nutrition.png',
    searchQuery: 'Pig',
    color: '#40916C',
  }
};

export default function AnimalNeedPage() {
  const { animal } = useParams<{ animal: string }>();
  
  const activeAnimalKey = useMemo<'cow' | 'pigeon' | 'pig' | 'hen'>(() => {
    // If no parameter, try to derive from window.location.pathname as a fallback
    const path = window.location.pathname.toLowerCase();
    const raw = (animal || path.replace(/^\//, '').split('/')[0] || '').toLowerCase();
    if (raw.includes('pigeon') || raw.includes('bird') || raw.includes('pura')) return 'pigeon';
    if (raw.includes('pig') || raw.includes('swine') || raw.includes('panri')) return 'pig';
    if (raw.includes('hen') || raw.includes('kozhi') || raw.includes('poultry') || raw.includes('chicken')) return 'hen';
    return 'cow'; // default to cow
  }, [animal]);

  const config = ANIMAL_CONFIGS[activeAnimalKey];

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // We do a broader search if possible. Some products might not have 'pigeon' in the name but their category does.
        // Or we can just fetch all and filter client side. For safety, let's fetch all and filter to ensure we get results if the search api isn't perfect.
        const res = await fetch('http://localhost:8000/api/products?limit=200');
        if (res.ok) {
          const data = await res.json();
          // Client-side filtering based on search query matching name or category
          const filtered = data.products.filter((p: any) => {
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div 
        className="relative pt-32 pb-20 px-4 text-center overflow-hidden"
        style={{ backgroundColor: config.color }}
      >
        <div className="absolute inset-0 opacity-20 flex items-center justify-center">
          <img src={config.heroImage} alt="Background" className="w-full h-full object-cover blur-sm opacity-50" />
        </div>
        <div className="relative z-10 container mx-auto text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">{config.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 drop-shadow-sm">{config.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Recommended Products for {config.title.split(' ')[0]}</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#86B841] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No specific products found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any products specifically matched to this animal in our current inventory.</p>
            <Link to="/shop" className="px-8 py-3 bg-[#86B841] text-white rounded-xl font-bold hover:bg-[#75A338] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg inline-block">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
