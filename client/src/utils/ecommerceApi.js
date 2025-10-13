import { supabase } from './supabase';

// =====================================================
// PRODUCTS API
// =====================================================

export const ecommerceApi = {
  // Get all products with filters
  async getProducts(filters = {}) {
    try {
      let query = supabase
        .from('ecommerce_products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters.season) {
        query = query.eq('season', filters.season);
      }
      if (filters.undertone) {
        query = query.eq('undertone', filters.undertone);
      }
      if (filters.isFeatured) {
        query = query.eq('is_featured', true);
      }
      if (filters.isNewArrival) {
        query = query.eq('is_new_arrival', true);
      }
      if (filters.isBestSeller) {
        query = query.eq('is_best_seller', true);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }
  },

  // Get single product by ID or slug
  async getProduct(idOrSlug) {
    try {
      let query = supabase
        .from('ecommerce_products')
        .select(`
          *,
          category:categories(id, name, slug),
          variants:product_variants(*),
          reviews:product_reviews(
            *,
            user:auth.users(id, email)
          )
        `)
        .eq('is_active', true);

      // Check if it's a UUID or slug
      if (idOrSlug.includes('-') && idOrSlug.length > 32) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      
      if (error) throw error;

      // Increment view count
      if (data) {
        await supabase
          .from('ecommerce_products')
          .update({ views_count: data.views_count + 1 })
          .eq('id', data.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  },

  // Get products by season (for Echo Style integration)
  async getProductsBySeason(season) {
    return this.getProducts({ season });
  },

  // =====================================================
  // CATEGORIES API
  // =====================================================

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  // =====================================================
  // SHOPPING CART API
  // =====================================================

  async getCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('shopping_cart')
        .select(`
          *,
          product:ecommerce_products(*),
          variant:product_variants(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { data: null, error };
    }
  },

  async addToCart(productId, variantId = null, quantity = 1) {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        throw new Error('User not authenticated');
      }

      const user = session.user;

      // Get product price
      const { data: product, error: productError } = await supabase
        .from('ecommerce_products')
        .select('price')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw new Error('Product not found');
      }

      const price = product?.price || 0;

      // Check if item already exists in cart
      const { data: existing, error: existingError } = await supabase
        .from('shopping_cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .is('variant_id', variantId)
        .maybeSingle();

      let result;
      if (existing) {
        // Update quantity
        result = await supabase
          .from('shopping_cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new item
        result = await supabase
          .from('shopping_cart')
          .insert({
            user_id: user.id,
            product_id: productId,
            variant_id: variantId,
            quantity,
            price
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { data: null, error };
    }
  },

  async updateCartItem(cartItemId, quantity) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { data: null, error };
    }
  },

  async removeFromCart(cartItemId) {
    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { error };
    }
  },

  async clearCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error };
    }
  },

  // =====================================================
  // ORDERS API
  // =====================================================

  async createOrder(orderData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          ...orderData
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items from cart
      const { data: cartItems } = await this.getCart();
      
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product.name,
        product_image: item.product.thumbnail_url,
        variant_name: item.variant?.name,
        sku: item.product.sku,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await this.clearCart();

      return { data: order, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error };
    }
  },

  async getOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error };
    }
  },

  async getOrder(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { data: null, error };
    }
  },

  // =====================================================
  // REVIEWS API
  // =====================================================

  async addReview(productId, reviewData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          ...reviewData
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding review:', error);
      return { data: null, error };
    }
  },

  async getProductReviews(productId) {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: null, error };
    }
  },

  // =====================================================
  // WISHLIST API
  // =====================================================

  async getWishlist() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:ecommerce_products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { data: null, error };
    }
  },

  async addToWishlist(productId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { data: null, error };
    }
  },

  async removeFromWishlist(productId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { error };
    }
  },

  async toggleWishlist(productId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existing) {
        return await this.removeFromWishlist(productId);
      } else {
        return await this.addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { error };
    }
  },

  // =====================================================
  // USER ADDRESSES API
  // =====================================================

  async getAddresses() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return { data: null, error };
    }
  },

  async addAddress(addressData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // If this is set as default, unset other defaults
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          ...addressData
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding address:', error);
      return { data: null, error };
    }
  },

  async updateAddress(addressId, addressData) {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating address:', error);
      return { data: null, error };
    }
  },

  async deleteAddress(addressId) {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting address:', error);
      return { error };
    }
  }
};

export default ecommerceApi;

