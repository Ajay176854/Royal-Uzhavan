import React from 'react';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Optimizing Milk Yield During Summer Months in Tamil Nadu",
      category: "Cattle Care",
      date: "August 10, 2026",
      image: "https://images.unsplash.com/photo-1596733430284-f74372763f03?auto=format&fit=crop&q=80",
      excerpt: "Summer heat can significantly drop milk production. Learn how adjusting feeding schedules and hydration strategies can help."
    },
    {
      id: 2,
      title: "Understanding Aflatoxins in Poultry Feed",
      category: "Poultry Health",
      date: "July 25, 2026",
      image: "https://images.unsplash.com/photo-1548550023-2bf3c49b1a03?auto=format&fit=crop&q=80",
      excerpt: "Why moldy grain is dangerous for your flock, and how Royal Uzhavan's rigorous testing keeps your birds safe."
    },
    {
      id: 3,
      title: "Goat Fattening: The 90-Day Plan",
      category: "Goat & Sheep",
      date: "July 12, 2026",
      image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80",
      excerpt: "A step-by-step feeding chart using our High-Yield Fattener to prepare goats for the festival season."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">Knowledge Hub</h1>
          <p className="text-lg text-gray-600">
            Expert farming advice, feeding charts, and seasonal care tips directly from our agronomists and veterinary consultants.
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-16 flex flex-col md:flex-row group cursor-pointer hover:border-[#0B4D26]/30 transition-colors">
          <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-gray-100 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#C9A227] text-white font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">Featured Guide</span>
              <span className="text-gray-500 text-sm flex items-center gap-1"><Calendar className="w-4 h-4" /> August 25, 2026</span>
            </div>
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4 group-hover:text-[#0B4D26] transition-colors">
              The Complete Guide to Organic Farm Composting
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Transform your farm waste into "black gold". We cover the exact ratios of nitrogen and carbon needed, and how adding our organic fertilizers speeds up the process.
            </p>
            <div className="flex items-center gap-2 text-[#0B4D26] font-bold mt-auto group-hover:gap-4 transition-all">
              Read Full Guide <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#0B4D26] font-bold px-3 py-1 rounded shadow-sm text-xs uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                  <Calendar className="w-4 h-4" /> {post.date}
                </div>
                <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-[#0B4D26] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[#C9A227] font-bold text-sm">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
