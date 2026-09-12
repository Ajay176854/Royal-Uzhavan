import baseProducts from '../data/products.json';

// --- Helper Functions ---
const getCustomProducts = () => {
  const custom = localStorage.getItem('custom_products');
  return custom ? JSON.parse(custom) : [];
};

const saveCustomProducts = (products: any[]) => {
  localStorage.setItem('custom_products', JSON.stringify(products));
};

const getAllProducts = () => {
  const customProducts = getCustomProducts();
  return [...customProducts, ...baseProducts];
};

const getOrdersFromStorage = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

const saveOrdersToStorage = (orders: any[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
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
    const products = getAllProducts();
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).map(name => {
      // Find the first product in this category to grab an image
      const product = products.find(p => p.category === name);
      return {
        id: name,
        name: name,
        image: product?.image || '/images/default.jpg'
      };
    });
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
    const custom = getCustomProducts();
    
    // We can only update custom products in localStorage
    const index = custom.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      custom[index] = { ...custom[index], ...data };
      saveCustomProducts(custom);
      return custom[index];
    } else {
      throw new Error("Cannot update base static products. Only newly added products can be updated in this static version.");
    }
  },

  deleteProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const custom = getCustomProducts();
    
    const filtered = custom.filter((p: any) => p.id !== id);
    if (filtered.length !== custom.length) {
      saveCustomProducts(filtered);
      return { success: true };
    } else {
      throw new Error("Cannot delete base static products. Only newly added products can be deleted.");
    }
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
