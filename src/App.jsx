import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import ThemePresets from './pages/ThemePresets';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';
import Coupons from './pages/Coupons';
import Support from './pages/Support';
import Promotions from './pages/Promotions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import UserControl from './pages/UserControl';
import Riders from './pages/Riders';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* Admin Routes */}
            <Route path="orders" element={<Orders />} />
            <Route path="riders" element={<Riders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="categories" element={<Categories />} />
            <Route path="marketing" element={<Banners />} />
            <Route path="customers" element={<Customers />} />
            <Route path="users-control" element={<UserControl />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="support" element={<Support />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="design" element={<ThemePresets />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
