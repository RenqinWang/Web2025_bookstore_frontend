import axios from 'axios';

const API_URL = 'http://localhost:5173/api';

/**
 * 用户服务 - 处理用户信息相关的 API 调用
 */
const userService = {
  /**
   * 更新用户信息
   * @param {number} userId 用户ID
   * @param {Object} userData 用户数据
   * @returns {Promise} 更新结果
   */
  updateUserInfo: async (userId, userData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/${userId}`,
        userData,
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '更新用户信息失败');
      }
    } catch (error) {
      console.error('更新用户信息错误:', error);
      throw error;
    }
  },

  /**
   * 上传用户头像
   * @param {number} userId 用户ID
   * @param {File} avatarFile 头像文件
   * @returns {Promise} 上传结果
   */
  uploadAvatar: async (userId, avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await axios.post(
        `${API_URL}/users/${userId}/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '上传头像失败');
      }
    } catch (error) {
      console.error('上传头像错误:', error);
      throw error;
    }
  },

  /**
   * 修改密码
   * @param {number} userId 用户ID
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码
   * @returns {Promise} 修改结果
   */
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/${userId}/password`,
        {
          oldPassword,
          newPassword
        },
        { withCredentials: true }
      );
      
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '修改密码失败');
      }
    } catch (error) {
      console.error('修改密码错误:', error);
      throw error;
    }
  },

  /**
   * 获取全部用户（仅管理员）
   * @returns {Promise} 用户列表
   */
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, { withCredentials: true });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取全部用户错误:', error);
      throw error;
    }
  },

  /**
   * 删除用户（仅管理员）
   * @param {number} userId 用户ID
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, { withCredentials: true });
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || '删除用户失败');
      }
    } catch (error) {
      console.error('删除用户错误:', error);
      throw error;
    }
  },

  /**
   * 管理员修改用户信息
   * @param {number} userId 用户ID
   * @param {Object} userData 用户数据
   * @returns {Promise}
   */
  adminUpdateUser: async (userId, userData) => {
    try {
      const response = await axios.patch(`${API_URL}/admin/users/${userId}`, userData, { withCredentials: true });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '修改用户信息失败');
      }
    } catch (error) {
      console.error('管理员修改用户信息错误:', error);
      throw error;
    }
  },

  /**
   * 禁用用户（仅管理员）
   * @param {number} userId 用户ID
   * @returns {Promise}
   */
  disableUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/admin/users/${userId}/disable`, {}, { withCredentials: true });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '禁用用户失败');
      }
    } catch (error) {
      console.error('禁用用户错误:', error);
      throw error;
    }
  }
};

export default userService; 