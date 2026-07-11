import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Header({ currentView, setView, openAuth }) {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);

  const navigateTo = (view) => {
    setView(view);
  };

  return (
    <header className="header">
      <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
        {/* Customized Elegant Kulfi Logo */}
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="35" y="10" width="30" height="60" rx="15" fill="url(#logoGrad)" />
          <line x1="50" y1="70" x2="50" y2="90" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" />
          <path d="M40 25C42 25 45 28 45 30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="logoGrad" x1="35" y1="10" x2="65" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f3e5ab" />
              <stop offset="0.5" stopColor="#d4af37" />
              <stop offset="1" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
        </svg>
        <span className="logo-text">Malai Kulfi</span>
      </a>

      <nav>
        <ul className="nav-links">
          <li>
            <a 
              href="#" 
              className={currentView === 'home' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={currentView === 'catalog' ? 'active' : ''} 
              onClick={(e) => { 
                e.preventDefault(); 
                if (!user) {
                  openAuth();
                } else {
                  navigateTo('catalog'); 
                }
              }}
            >
              Catalog
            </a>
          </li>
          {user && user.role === 'admin' && (
            <li>
              <a 
                href="#" 
                className={currentView === 'admin' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}
              >
                Admin Panel
              </a>
            </li>
          )}
        </ul>
      </nav>

      <div className="nav-actions">
        {/* Cart Trigger Badge */}
        <button 
          className="btn btn-secondary btn-badge-container" 
          onClick={() => navigateTo('cart')}
          title="Shopping Cart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>

        {/* User Account Controls */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#f3e5ab' }}>
              Hi, {user.name.split(' ')[0]}
            </span>
            <button className="btn btn-danger" onClick={logout} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={openAuth}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
