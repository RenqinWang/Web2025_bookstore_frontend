import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 订单服务 - 处理订单相关的 API 调用
 */
const orderService = {
  /**
   * 创建订单
   * @param {Object} orderData 订单数据
   * @returns {Promise} 创建结果
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '创建订单失败');
      }
    } catch (error) {
      console.error('创建订单错误:', error);
      throw error;
    }
  },

  /**
   * 获取订单列表
   * @param {Object} params 查询参数
   * @returns {Promise} 订单列表数据
   */
  getOrders: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        params,
        withCredentials: true
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取订单列表失败');
      }
    } catch (error) {
      console.error('获取订单列表错误:', error);
      throw error;
    }
  },

  /**
   * 获取订单详情
   * @param {number} id 订单ID
   * @returns {Promise} 订单详情数据
   */
  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        withCredentials: true
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取订单详情失败');
      }
    } catch (error) {
      console.error('获取订单详情错误:', error);
      throw error;
    }
  },

  /**
   * 取消订单
   * @param {number} id 订单ID
   * @returns {Promise} 取消结果
   */
  cancelOrder: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/orders/${id}/cancel`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '取消订单失败');
      }
    } catch (error) {
      console.error('取消订单错误:', error);
      throw error;
    }
  },

  /**
   * 获取所有用户订单（仅管理员）
   * @param {Object} params 查询参数
   * @returns {Promise} 所有用户订单列表数据
   */
  getAllOrders: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders`, {
        params,
        withCredentials: true
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取所有用户订单失败');
      }
    } catch (error) {
      console.error('获取所有用户订单错误:', error);
      throw error;
    }
  }
};

export default orderService; 