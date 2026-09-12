import { MetadataRoute } from 'next';
import baseProducts from '../data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://royaluzhavan.com';

  const staticRoutes = [
    '',
    '/shop',
    '/cow',
    '/hen',
    '/pig',
    '/pigeon',
    '/our-farms',
    '/contact',
    '/blog',
    '/policies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes = baseProducts.map((product) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(product.category)}`, // Based on existing routing setup
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // deduplicate product categories
  const uniqueCategories = Array.from(new Set(productRoutes.map(p => p.url))).map(url => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...uniqueCategories];
}
