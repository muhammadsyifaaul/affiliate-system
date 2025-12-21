import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Pages - placeholder imports
import Login from './pages/Login';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import ProductPage from './pages/ProductPage';

const Navbar = () => {
  const location = useLocation(); // Forces re-render on route change
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
      <div className="container flex-between">
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>
          Affiliate<span style={{ color: 'var(--primary)' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/faq" className="btn btn-outline">FAQ</Link>
          {!user ? (
            <Link to="/login" className="btn btn-primary">Login</Link>
          ) : (
            <>
              {user.is_staff && <Link to="/admin" className="btn btn-outline">Admin</Link>}
              <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
              <button onClick={() => {
                localStorage.removeItem('auth');
                localStorage.removeItem('user');
                window.location.href = '/';
              }} className="btn btn-outline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter basename="/affiliate-system">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AffiliateDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
