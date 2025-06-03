import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 购物车服务 - 处理购物车相关的 API 调用
 */
const cartService = {
  /**
   * 获取购物车列表
   * @returns {Promise} 购物车数据
   */
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, { 
        withCredentials: true 
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取购物车失败');
      }
    } catch (error) {
      console.error('获取购物车错误:', error);
      throw error;
    }
  },

  /**
   * 添加商品到购物车
   * @param {number} bookId 图书ID
   * @param {number} quantity 数量
   * @returns {Promise} 添加结果
   */
  addToCart: async (bookId, quantity = 1) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/items`, 
        {
          book_id: bookId,
          quantity
        },
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '添加到购物车失败');
      }
    } catch (error) {
      console.error('添加到购物车错误:', error);
      throw error;
    }
  },

  /**
   * 更新购物车商品数量
   * @param {number} itemId 购物车项ID
   * @param {number} quantity 新数量
   * @returns {Promise} 更新结果
   */
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await axios.patch(
        `${API_URL}/cart/items/${itemId}`,
        { quantity },
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '更新购物车失败');
      }
    } catch (error) {
      console.error('更新购物车错误:', error);
      throw error;
    }
  },

  /**
   * 从购物车移除商品
   * @param {number} itemId 购物车项ID
   * @returns {Promise} 移除结果
   */
  removeFromCart: async (itemId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/items/${itemId}`,
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '移除购物车项失败');
      }
    } catch (error) {
      console.error('移除购物车项错误:', error);
      throw error;
    }
  },

  /**
   * 清空购物车
   * @returns {Promise} 清空结果
   */
  clearCart: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/clear`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '清空购物车失败');
      }
    } catch (error) {
      console.error('清空购物车错误:', error);
      throw error;
    }
  }
};

export default cartService; 