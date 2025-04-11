import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { userStorage } from '../utils/storage';

import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import UserProfile from '../pages/UserProfile';

// 权限控制组件
const PrivateRoute = ({ children }) => {
    const isAuthenticated = userStorage.isLoggedIn();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function Routers() {
    return (
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
    )
}