'use client';
import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import featuredBlogImg from '../assets/images/featured_blog.jpg';
import poultryBlogImg from '../assets/images/poultry_blog.jpg';
import cattleBlogImg from '../assets/images/cattle_blog.jpg';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const featuredPost = {
    id: 'featured',
    title: "Royal Uzhavan Livestock Management System",
    image: featuredBlogImg.src,
    content: (
      <>
        <p className="lead text-xl text-gray-800 mb-6 font-medium">
          The Royal Uzhavan livestock management system drives lifetime dairy productivity through precision-balanced dry matter and silage feeding, strategic transition care to prevent metabolic disorders, strict milestone-based calf rearing, and proactive seasonal biosecurity and breeding protocols.
        </p>
        <p className="mb-6">
          Our comprehensive approach ensures that your herd receives the exact nutrition required at every stage of their lifecycle. By carefully monitoring dry matter intake and supplementing with high-quality silage, we maximize yield while maintaining optimal animal health.
        </p>
        <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Strategic Transition Care</h4>
        <p className="mb-6">
          The transition period is the most critical time in a dairy cow's life. Our protocols are designed to smoothly transition the cow from gestation into lactation, minimizing the risk of common metabolic disorders and setting the stage for a highly productive lactation cycle.
        </p>
        <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Milestone-Based Calf Rearing</h4>
        <p className="mb-6">
          Future productivity begins with the calf. We implement strict milestone-based rearing protocols focusing on colostrum management, targeted growth rates, and early rumen development to ensure robust, healthy replacements for your herd.
        </p>
      </>
    )
  };

  const posts = [
    {
      id: 1,
      title: "Optimizing Milk Yield During Summer Months in Tamil Nadu",
      category: "Cattle Care",
      date: "August 10, 2026",
      image: cattleBlogImg.src,
      excerpt: "Summer heat can significantly drop milk production. Learn how adjusting feeding schedules and hydration strategies can help.",
      content: (
        <>
          <p className="lead text-xl text-gray-800 mb-6 font-medium">Summer heat can significantly drop milk production. Learn how adjusting feeding schedules and hydration strategies can help.</p>
          <p className="mb-6">During peak summer, dairy cattle experience heat stress which directly impacts their dry matter intake and consequently, milk yield. Providing ample shade and continuous access to clean, cool drinking water is the first line of defense.</p>
          <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Adjusting Feeding Times</h4>
          <p className="mb-6">Shift the majority of feeding to the cooler parts of the day—early morning and late evening. This encourages higher intake and reduces the metabolic heat load during the hottest hours.</p>
        </>
      )
    },
    {
      id: 2,
      title: "Understanding Aflatoxins in Poultry Feed",
      category: "Poultry Health",
      date: "July 25, 2026",
      image: poultryBlogImg.src,
      excerpt: "Why moldy grain is dangerous for your flock, and how Royal Uzhavan's rigorous testing keeps your birds safe.",
      content: (
        <>
          <p className="lead text-xl text-gray-800 mb-6 font-medium">Why moldy grain is dangerous for your flock, and how Royal Uzhavan's rigorous testing keeps your birds safe.</p>
          <p className="mb-6">Aflatoxins are toxic compounds produced by certain molds found in agricultural crops. In poultry, even low levels can cause liver damage, reduced growth rates, and a compromised immune system.</p>
          <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Testing Protocols</h4>
          <p className="mb-6">At Royal Uzhavan, every batch of grain is rigorously tested for mycotoxins before processing. We ensure that our poultry feed is completely safe, helping your flock grow healthy and strong.</p>
        </>
      )
    },
    {
      id: 3,
      title: "Goat Fattening: The 90-Day Plan",
      category: "Goat & Sheep",
      date: "July 12, 2026",
      image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80",
      excerpt: "A step-by-step feeding chart using our High-Yield Fattener to prepare goats for the festival season.",
      content: (
        <>
          <p className="lead text-xl text-gray-800 mb-6 font-medium">A step-by-step feeding chart using our High-Yield Fattener to prepare goats for the festival season.</p>
          <p className="mb-6">Achieving optimal market weight requires a balanced diet high in energy and protein. Our 90-day plan is designed to maximize daily weight gain safely.</p>
          <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">The Feeding Strategy</h4>
          <p className="mb-6">Start by gradually introducing the fattener mix over a week to prevent digestive upset. Ensure ad libitum access to good quality forage and fresh water throughout the fattening period.</p>
        </>
      )
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
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-16 flex flex-col md:flex-row group cursor-pointer hover:border-[#0B4D26]/30 transition-colors" onClick={() => setSelectedPost(featuredPost)}>
          <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-gray-100 overflow-hidden">
            <img src={featuredBlogImg.src} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4 group-hover:text-[#0B4D26] transition-colors">
              Practical feeding charts, livestock nutrition advice, and seasonal herd care directly from the Royal Uzhavan team.
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed line-clamp-3">
              The Royal Uzhavan livestock management system drives lifetime dairy productivity through precision-balanced dry matter and silage feeding, strategic transition care to prevent metabolic disorders, strict milestone-based calf rearing, and proactive seasonal biosecurity and breeding protocols.
            </p>
            <div className="flex items-center gap-2 text-[#0B4D26] font-bold mt-auto group-hover:gap-4 transition-all">
              Read Full Guide <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedPost(post)}>
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

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="text-2xl font-playfair font-bold text-[#0B4D26]">{selectedPost.title}</h3>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 md:p-10">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-8">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
              <div className="prose prose-lg max-w-none text-gray-600">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


