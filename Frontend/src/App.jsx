// ===== STEP 5: App routes - auth pages + admin protection =====
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import { AuthProvider } from './context/AuthContext'   // auth state provider
import { CartProvider } from './context/CartContext'   // cart state provider (backend API)
import { WishlistProvider } from './context/WishlistContext' // wishlist state provider
import ProtectedRoute from './components/ProtectedRoute' // role-based guard

import UserLayout from './layouts/UserLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import Home from './pages/user/Home.jsx'
import ProductDetail from './pages/user/ProductDetail.jsx'
import Checkout from './pages/user/Checkout.jsx'           // address + payment + place order
import OrderConfirmation from './pages/user/OrderConfirmation.jsx' // order detail
import Orders from './pages/user/Orders.jsx'               // order history
import Login from './pages/user/Login.jsx'         // naya auth page
import Register from './pages/user/Register.jsx'   // naya auth page
import Dashboard from './pages/admin/Dashboard.jsx'
import ManageCategories from './pages/admin/ManageCategories.jsx'
import ManageProducts from './pages/admin/ManageProducts.jsx'

export default function App() {
  // AuthProvider se poora app cover - taake useAuth() har jagah kaam kare
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              {/* ===== User side (public) ===== */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Route>

              {/* ===== Cart / Order side (login zaroori) ===== */}
              <Route element={<ProtectedRoute />}>
                <Route element={<UserLayout />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order/:id" element={<OrderConfirmation />} />
                </Route>
              </Route>

              {/* ===== Auth pages (standalone - no header/footer) ===== */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ===== Admin side (sirf admin role) =====
                  ProtectedRoute: bina login -> /login, normal user -> / */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="products" element={<ManageProducts />} />
                </Route>
              </Route>

              {/* ===== 404 Fallback ===== */}
              <Route path="*" element={<h2 className="p-8 text-center">404 - Page Not Found</h2>} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}