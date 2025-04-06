import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import UserProfile from './pages/UserProfile';
import './App.css';

// 权限控制组件
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/book/:id" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <BookDetail />
                </MainLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/cart" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <Cart />
                </MainLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <Orders />
                </MainLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <UserProfile />
                </MainLayout>
              </PrivateRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
