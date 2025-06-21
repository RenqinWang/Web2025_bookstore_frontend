import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useAuth, AuthProvider } from '../contexts/AuthContext';

import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import UserProfile from '../pages/UserProfile';
import BookManagement from '../pages/BookManagement';
import UserManagement from '../pages/UserManagement';
import Statistics from '../pages/Statistics';
import OrderManagement from '../pages/OrderManagement';

// 权限控制组件
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    // 如果认证状态仍在加载中，可以显示加载状态
    if (loading) {
        return <div>加载中...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// 管理员权限控制组件
const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return <div>加载中...</div>;
    }
    return currentUser && currentUser.role === 'admin' ? children : <Navigate to="/" />;
};

export default function Routers() {
    return (
        <BrowserRouter>
            <AuthProvider>
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
                    
                    <Route 
                        path="/book-management" 
                        element={
                        <PrivateRoute>
                            <AdminRoute>
                                <MainLayout>
                                <BookManagement />
                                </MainLayout>
                            </AdminRoute>
                        </PrivateRoute>
                        } 
                    />
                    
                    <Route 
                        path="/user-management" 
                        element={
                        <PrivateRoute>
                            <AdminRoute>
                                <MainLayout>
                                <UserManagement />
                                </MainLayout>
                            </AdminRoute>
                        </PrivateRoute>
                        } 
                    />
                    
                    <Route 
                        path="/statistics" 
                        element={
                        <PrivateRoute>
                            <MainLayout>
                            <Statistics />
                            </MainLayout>
                        </PrivateRoute>
                        } 
                    />
                    
                    <Route 
                        path="/order-management" 
                        element={
                        <PrivateRoute>
                            <AdminRoute>
                                <MainLayout>
                                <OrderManagement />
                                </MainLayout>
                            </AdminRoute>
                        </PrivateRoute>
                        } 
                    />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}