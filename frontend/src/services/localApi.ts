import baseProducts from '../data/products.json';

// SSR-safe localStorage helpers
const safeGetItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const safeSetItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

// --- Helper Functions ---
const getCustomProducts = () => {
  const custom = safeGetItem('custom_products');
  return custom ? JSON.parse(custom) : [];
};

const saveCustomProducts = (products: any[]) => {
  safeSetItem('custom_products', JSON.stringify(products));
};

const getModifiedProducts = () => {
  const modified = safeGetItem('modified_products');
  return modified ? JSON.parse(modified) : {};
};

const saveModifiedProducts = (productsDict: Record<string, any>) => {
  safeSetItem('modified_products', JSON.stringify(productsDict));
};

const getDeletedProductIds = () => {
  const deleted = safeGetItem('deleted_products');
  return deleted ? JSON.parse(deleted) : [];
};

const saveDeletedProductIds = (ids: string[]) => {
  safeSetItem('deleted_products', JSON.stringify(ids));
};

const getCustomCategories = () => {
  const cats = safeGetItem('custom_categories');
  return cats ? JSON.parse(cats) : [];
};

const saveCustomCategories = (cats: any[]) => {
  safeSetItem('custom_categories', JSON.stringify(cats));
};

const getAllProducts = () => {
  const customProducts = getCustomProducts();
  const modifiedProducts = getModifiedProducts();
  const deletedIds = getDeletedProductIds();

  const validBaseProducts = baseProducts
    .filter(p => !deletedIds.includes(p.id))
    .map(p => modifiedProducts[p.id] || p);

  return [...customProducts, ...validBaseProducts];
};

const getOrdersFromStorage = () => {
  const orders = safeGetItem('orders');
  return orders ? JSON.parse(orders) : [];
};

const saveOrdersToStorage = (orders: any[]) => {
  safeSetItem('orders', JSON.stringify(orders));
};

// --- Product API ---
export const localApi = {
  getProducts: async (params?: { category?: string; search?: string; limit?: number }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let products = getAllProducts();

    if (params?.category) {
      products = products.filter(p => 
        p.category.toLowerCase() === params.category!.toLowerCase() ||
        p.animal_type?.toLowerCase() === params.category!.toLowerCase() // support animal type filtering
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (params?.limit) {
      products = products.slice(0, params.limit);
    }

    return products;
  },

  getProductById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const products = getAllProducts();
    const product = products.find(p => p.id === id || p.slug === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Custom explicit categories
    const customCats = getCustomCategories();
    
    // Dynamic categories from products
    const products = getAllProducts();
    const categories = new Set(products.map(p => p.category).filter(Boolean));
    
    const dynamicCats = Array.from(categories).map(name => {
      const product = products.find(p => p.category === name);
      return {
        id: name,
        name: name,
        image: product?.image || '/images/default.jpg'
      };
    });

    // Merge them, preferring custom ones if names overlap
    const mergedMap = new Map();
    dynamicCats.forEach((c: any) => mergedMap.set(c.name, c));
    customCats.forEach((c: any) => mergedMap.set(c.name, c));

    return Array.from(mergedMap.values());
  },

  addCategory: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const custom = getCustomCategories();
    const newCategory = {
      id: crypto.randomUUID(),
      name: data.name,
      image: data.image || '/images/default.jpg',
      created_at: new Date().toISOString()
    };
    custom.push(newCategory);
    saveCustomCategories(custom);
    return newCategory;
  },

  deleteCategory: async (name: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const custom = getCustomCategories();
    const filtered = custom.filter((c: any) => c.name !== name);
    saveCustomCategories(filtered);
    return { success: true };
  },

  addProduct: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const custom = getCustomProducts();
    
    const newProduct = {
      ...data,
      id: 'custom-' + Date.now().toString(),
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString()
    };
    
    custom.unshift(newProduct);
    saveCustomProducts(custom);
    return newProduct;
  },

  updateProduct: async (id: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Check if it's a custom product first
    const custom = getCustomProducts();
    const customIndex = custom.findIndex((p: any) => p.id === id);
    
    if (customIndex !== -1) {
      custom[customIndex] = { ...custom[customIndex], ...data };
      saveCustomProducts(custom);
      return custom[customIndex];
    }
    
    // Otherwise it's a base product (or previously modified)
    const modified = getModifiedProducts();
    const baseProduct = baseProducts.find(p => p.id === id);
    
    if (baseProduct) {
      // Merge base product with existing modifications (if any) and new data
      const currentData = modified[id] || baseProduct;
      modified[id] = { ...currentData, ...data };
      saveModifiedProducts(modified);
      return modified[id];
    }

    throw new Error("Product not found");
  },

  deleteProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Check custom products
    const custom = getCustomProducts();
    const filteredCustom = custom.filter((p: any) => p.id !== id);
    
    if (filteredCustom.length !== custom.length) {
      saveCustomProducts(filteredCustom);
      return { success: true };
    }
    
    // If it's a base product, mark it as deleted
    const baseProduct = baseProducts.find(p => p.id === id);
    if (baseProduct) {
      const deletedIds = getDeletedProductIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        saveDeletedProductIds(deletedIds);
      }
      return { success: true };
    }

    throw new Error("Product not found");
  },

  // --- Order API ---
  createOrder: async (orderData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = getOrdersFromStorage();
    
    const newOrder = {
      id: 'ord-' + Date.now(),
      ...orderData,
      status: 'Processing',
      created_at: new Date().toISOString()
    };
    
    orders.unshift(newOrder);
    saveOrdersToStorage(orders);
    return newOrder;
  },

  getOrders: async (params?: { limit?: number; search?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let orders = getOrdersFromStorage();
    
    if (params?.search) {
      const q = params.search.toLowerCase();
      orders = orders.filter((o: any) => 
        o.id.toLowerCase().includes(q) || 
        o.shipping_address?.full_name?.toLowerCase().includes(q)
      );
    }
    
    if (params?.limit) {
      orders = orders.slice(0, params.limit);
    }
    
    return orders;
  },

  updateOrderStatus: async (id: string, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const orders = getOrdersFromStorage();
    
    const order = orders.find((o: any) => o.id === id);
    if (order) {
      order.status = status;
      saveOrdersToStorage(orders);
      return order;
    }
    throw new Error('Order not found');
  },

  getAdminStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const orders = getOrdersFromStorage();
    const products = getAllProducts();
    
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.status === 'Processing').length;
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders
    };
  }
};
