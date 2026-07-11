import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Views
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const [view, setView] = useState('home'); // 'home', 'catalog', 'cart', 'checkout', 'admin'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  // Prevent accessing pages if not logged in
  const handleSetView = (newView) => {
    if ((newView === 'catalog' || newView === 'checkout' || newView === 'admin') && !user) {
      setIsAuthOpen(true);
    } else if (newView === 'admin' && user?.role !== 'admin') {
      setView('home');
    } else {
      setView(newView);
    }
  };

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return <Home setView={handleSetView} openAuth={openAuth} />;
      case 'catalog':
        return <Catalog />;
      case 'cart':
        return <Cart setView={handleSetView} openAuth={openAuth} />;
      case 'checkout':
        return <Checkout setView={handleSetView} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <Home setView={handleSetView} openAuth={openAuth} />;
      default:
        return <Home setView={handleSetView} openAuth={openAuth} />;
    }
  };

  return (
    <div className="app-container">
      <Header currentView={view} setView={handleSetView} openAuth={openAuth} />
      
      <main>
        {renderActiveView()}
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
