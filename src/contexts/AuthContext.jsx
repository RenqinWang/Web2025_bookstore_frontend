import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// 创建认证上下文
const AuthContext = createContext(null);

// 自定义钩子，用于在组件中访问认证上下文
export const useAuth = () => useContext(AuthContext);

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始加载时检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('检查认证状态时出错:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录方法
  const login = async (username, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authService.login(username, password);
      if (data && data.username) {
        setCurrentUser(data);
        setIsAuthenticated(true);
        await authService.getCurrentUser();
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('登出时出错:', error);
      throw error;
    }
  };

  // 上下文值
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 