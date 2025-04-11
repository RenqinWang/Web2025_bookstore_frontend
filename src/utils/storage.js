/**
 * localStorage 工具类
 * 用于处理所有与 localStorage 相关的操作
 * 为将来接入后端做准备，将数据操作集中管理
 */

// 存储键名常量
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  CART: 'cart',
  ORDERS: 'orders',
  FAVORITES: 'favorites'
};

/**
 * 用户相关操作
 */
export const userStorage = {
  /**
   * 获取当前登录用户
   * @returns {Object|null} 用户对象或null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * 设置当前登录用户
   * @param {Object} user 用户对象
   */
  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  /**
   * 清除当前登录用户
   */
  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn: () => {
    return !!localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * 更新用户信息
   * @param {Object} userInfo 要更新的用户信息
   */
  updateUserInfo: (userInfo) => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userInfo };
      userStorage.setCurrentUser(updatedUser);
      return updatedUser;
    }
    return null;
  }
};

/**
 * 购物车相关操作
 */
export const cartStorage = {
  /**
   * 获取购物车商品
   * @returns {Array} 购物车商品数组
   */
  getCartItems: () => {
    const cartStr = localStorage.getItem(STORAGE_KEYS.CART);
    return cartStr ? JSON.parse(cartStr) : [];
  },

  /**
   * 设置购物车商品
   * @param {Array} items 购物车商品数组
   */
  setCartItems: (items) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  },

  /**
   * 添加商品到购物车
   * @param {Object} item 商品对象
   * @param {number} quantity 数量
   * @returns {Array} 更新后的购物车商品数组
   */
  addToCart: (item, quantity = 1) => {
    const cartItems = cartStorage.getCartItems();
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        id: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        cover: item.cover,
        quantity: quantity
      });
    }
    
    cartStorage.setCartItems(cartItems);
    return cartItems;
  },

  /**
   * 从购物车移除商品
   * @param {number} itemId 商品ID
   * @returns {Array} 更新后的购物车商品数组
   */
  removeFromCart: (itemId) => {
    const cartItems = cartStorage.getCartItems();
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    cartStorage.setCartItems(updatedCart);
    return updatedCart;
  },

  /**
   * 更新购物车商品数量
   * @param {number} itemId 商品ID
   * @param {number} quantity 新数量
   * @returns {Array} 更新后的购物车商品数组
   */
  updateCartItemQuantity: (itemId, quantity) => {
    const cartItems = cartStorage.getCartItems();
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    cartStorage.setCartItems(updatedCart);
    return updatedCart;
  },

  /**
   * 清空购物车
   */
  clearCart: () => {
    cartStorage.setCartItems([]);
  },

  /**
   * 获取购物车商品总数
   * @returns {number} 商品总数
   */
  getCartItemCount: () => {
    const cartItems = cartStorage.getCartItems();
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * 计算购物车总价
   * @returns {number} 总价
   */
  calculateCartTotal: () => {
    const cartItems = cartStorage.getCartItems();
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};

/**
 * 订单相关操作
 */
export const orderStorage = {
  /**
   * 获取所有订单
   * @returns {Array} 订单数组
   */
  getOrders: () => {
    const ordersStr = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return ordersStr ? JSON.parse(ordersStr) : [];
  },

  /**
   * 设置所有订单
   * @param {Array} orders 订单数组
   */
  setOrders: (orders) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  /**
   * 添加新订单
   * @param {Object} order 订单对象
   * @returns {Array} 更新后的订单数组
   */
  addOrder: (order) => {
    const orders = orderStorage.getOrders();
    orders.push(order);
    orderStorage.setOrders(orders);
    return orders;
  },

  /**
   * 更新订单状态
   * @param {number} orderId 订单ID
   * @param {string} status 新状态
   * @returns {Array} 更新后的订单数组
   */
  updateOrderStatus: (orderId, status) => {
    const orders = orderStorage.getOrders();
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    orderStorage.setOrders(updatedOrders);
    return updatedOrders;
  },

  /**
   * 获取订单详情
   * @param {number} orderId 订单ID
   * @returns {Object|null} 订单对象或null
   */
  getOrderById: (orderId) => {
    const orders = orderStorage.getOrders();
    return orders.find(order => order.id === orderId) || null;
  }
};

/**
 * 收藏夹相关操作
 */
export const favoriteStorage = {
  /**
   * 获取收藏的书籍
   * @returns {Array} 收藏的书籍数组
   */
  getFavorites: () => {
    const favoritesStr = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  },

  /**
   * 设置收藏的书籍
   * @param {Array} favorites 收藏的书籍数组
   */
  setFavorites: (favorites) => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  /**
   * 添加书籍到收藏夹
   * @param {Object} book 书籍对象
   * @returns {Array} 更新后的收藏夹
   */
  addToFavorites: (book) => {
    const favorites = favoriteStorage.getFavorites();
    if (!favorites.some(item => item.id === book.id)) {
      favorites.push(book);
      favoriteStorage.setFavorites(favorites);
    }
    return favorites;
  },

  /**
   * 从收藏夹移除书籍
   * @param {number} bookId 书籍ID
   * @returns {Array} 更新后的收藏夹
   */
  removeFromFavorites: (bookId) => {
    const favorites = favoriteStorage.getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== bookId);
    favoriteStorage.setFavorites(updatedFavorites);
    return updatedFavorites;
  },

  /**
   * 检查书籍是否已收藏
   * @param {number} bookId 书籍ID
   * @returns {boolean} 是否已收藏
   */
  isFavorite: (bookId) => {
    const favorites = favoriteStorage.getFavorites();
    return favorites.some(item => item.id === bookId);
  }
};

/**
 * 通用存储操作
 */
export const storage = {
  /**
   * 获取存储项
   * @param {string} key 存储键
   * @returns {any} 存储的值
   */
  get: (key) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return value;
    }
  },

  /**
   * 设置存储项
   * @param {string} key 存储键
   * @param {any} value 要存储的值
   */
  set: (key, value) => {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, valueToStore);
  },

  /**
   * 移除存储项
   * @param {string} key 存储键
   */
  remove: (key) => {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有存储
   */
  clear: () => {
    localStorage.clear();
  }
};

export default {
  userStorage,
  cartStorage,
  orderStorage,
  favoriteStorage,
  storage,
  STORAGE_KEYS
}; 