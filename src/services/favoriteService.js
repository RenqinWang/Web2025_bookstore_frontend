import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 收藏服务 - 处理收藏相关的 API 调用
 */
const favoriteService = {
  /**
   * 获取收藏列表
   * @param {Object} params 查询参数
   * @returns {Promise} 收藏列表数据
   */
  getFavorites: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/favorites`, {
        params,
        withCredentials: true
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取收藏列表失败');
      }
    } catch (error) {
      console.error('获取收藏列表错误:', error);
      throw error;
    }
  },

  /**
   * 添加收藏
   * @param {number} bookId 图书ID
   * @returns {Promise} 添加结果
   */
  addFavorite: async (bookId) => {
    try {
      const response = await axios.post(
        `${API_URL}/favorites`,
        { book_id: bookId },
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '添加收藏失败');
      }
    } catch (error) {
      console.error('添加收藏错误:', error);
      throw error;
    }
  },

  /**
   * 取消收藏
   * @param {number} bookId 图书ID
   * @returns {Promise} 取消结果
   */
  removeFavorite: async (bookId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/favorites/${bookId}`,
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '取消收藏失败');
      }
    } catch (error) {
      console.error('取消收藏错误:', error);
      throw error;
    }
  },

  /**
   * 检查是否已收藏
   * @param {number} bookId 图书ID
   * @returns {Promise<boolean>} 是否已收藏
   */
  checkIsFavorite: async (bookId) => {
    try {
      const response = await axios.get(
        `${API_URL}/favorites/check/${bookId}`,
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data.is_favorite;
      } else {
        throw new Error(response.data.message || '检查收藏状态失败');
      }
    } catch (error) {
      console.error('检查收藏状态错误:', error);
      return false;
    }
  }
};

export default favoriteService; 