import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 认证服务 - 处理用户登录、注册、登出等认证相关操作
 */
const authService = {
  /**
   * 用户登录
   * @param {string} username 用户名
   * @param {string} password 密码
   * @returns {Promise} 包含用户信息的 Promise
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      }, { withCredentials: true }); // withCredentials 确保 Cookie 能被正确设置
      
      if (response.data.code === 200) {
        // 登录成功，返回用户信息
        return response.data.data;
      } else {
        throw new Error(response.data.message || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  },

  /**
   * 用户注册
   * @param {Object} userInfo 用户信息
   * @returns {Promise} 包含新用户信息的 Promise
   */
  register: async (userInfo) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userInfo);
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      throw error;
    }
  },

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, 
        { withCredentials: true });
      
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '登出失败');
      }
    } catch (error) {
      console.error('登出错误:', error);
      throw error;
    }
  },

  /**
   * 获取当前登录用户信息
   * @returns {Promise} 包含用户信息的 Promise
   */
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/current`, 
        { withCredentials: true });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取用户信息失败');
      }
    } catch (error) {
      console.error('获取用户信息错误:', error);
      return null;
    }
  },

  /**
   * 检查用户是否已登录(通过调用 getCurrentUser 方法实现)
   * @returns {Promise<boolean>} 是否已登录
   */
  isAuthenticated: async () => {
    try {
      const user = await authService.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
};

export default authService; 