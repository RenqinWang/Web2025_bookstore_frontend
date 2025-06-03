import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 图书服务 - 处理图书相关的 API 调用
 */
const bookService = {
  /**
   * 获取图书列表
   * @param {Object} params 查询参数
   * @returns {Promise} 图书列表数据
   */
  getBooks: async (params = {}) => {
    try {
      console.log('调用 getBooks API, 参数:', params);
      const response = await axios.get(`${API_URL}/books`, { 
        params,
        withCredentials: true 
      });
      
      console.log('getBooks API 响应:', response.data);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取图书列表失败');
      }
    } catch (error) {
      console.error('获取图书列表错误:', error);
      throw error;
    }
  },

  /**
   * 获取图书详情
   * @param {number} id 图书ID
   * @returns {Promise} 图书详情数据
   */
  getBookById: async (id) => {
    try {
      console.log('调用 getBookById API, id:', id);
      const response = await axios.get(`${API_URL}/books/${id}`, { 
        withCredentials: true 
      });
      
      console.log('getBookById API 响应:', response.data);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取图书详情失败');
      }
    } catch (error) {
      console.error('获取图书详情错误:', error);
      throw error;
    }
  },

  /**
   * 获取图书分类列表
   * @returns {Promise} 分类列表数据
   */
  getCategories: async () => {
    try {
      console.log('调用 getCategories API');
      const response = await axios.get(`${API_URL}/categories`, { 
        withCredentials: true 
      });
      
      console.log('getCategories API 响应:', response.data);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表错误:', error);
      throw error;
    }
  },

  /**
   * 添加图书（仅管理员）
   * @param {Object} bookData 图书数据
   * @returns {Promise} 新增图书数据
   */
  createBook: async (bookData) => {
    try {
      const response = await axios.post(`${API_URL}/books`, bookData, { withCredentials: true });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '添加图书失败');
      }
    } catch (error) {
      console.error('添加图书错误:', error);
      throw error;
    }
  },

  /**
   * 编辑图书（仅管理员）
   * @param {number} id 图书ID
   * @param {Object} bookData 图书数据
   * @returns {Promise} 修改后的图书数据
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await axios.patch(`${API_URL}/books/${id}`, bookData, { withCredentials: true });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '修改图书失败');
      }
    } catch (error) {
      console.error('修改图书错误:', error);
      throw error;
    }
  },

  /**
   * 删除图书（仅管理员）
   * @param {number} id 图书ID
   * @returns {Promise} 删除结果
   */
  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/books/${id}`, { withCredentials: true });
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '删除图书失败');
      }
    } catch (error) {
      console.error('删除图书错误:', error);
      throw error;
    }
  }
};

export default bookService; 