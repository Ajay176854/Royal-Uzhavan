export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  animal_type?: string;
  name_tamil?: string;

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
