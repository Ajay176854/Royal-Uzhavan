export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  animal_type?: string;
  price: number | string; // Numeric coming from PG might be string sometimes depending on pg driver, but let's assume number or parse it. The backend uses DECIMAL so pg driver returns string. Let's make it number | string.
  original_price?: number | string;
  discount?: number;
  rating: number | string;
  reviews: number;
  image: string;
  tags: string[];
  variants: number[];
  in_stock: boolean;
  description?: string;
  created_at?: string;
}

export interface Category {
  id?: string;
  name: string;
  image: string;
  product_count?: number;
}
