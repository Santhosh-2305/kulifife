import React, { useState, useEffect, useContext } from 'react';
import InteractiveKulfi from '../components/InteractiveKulfi';
import { AuthContext, API_URL } from '../context/AuthContext';

export default function Home({ setView, openAuth }) {
  const { user } = useContext(AuthContext);
  const [kulfis, setKulfis] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default fallback data in case backend is loading/unreachable initially
  const defaultFlavors = [
    {
      name: 'Classic Malai',
      description: 'The timeless, traditional cream kulfi flavored with ground cardamom, saffron strands, and condensed milk. Slow-cooked to thick perfection.',
      price: 30,
      ingredients: ['Heavy Cream', 'Condensed Milk', 'Cardamom Powder', 'Saffron', 'Sugar'],
      rating: 4.9,
      reviews: 245,
      color: '#FFF9E6',
      category: 'Classic'
    },
    {
      name: 'Kesar Pista',
      description: 'A luxurious blend of royal saffron (Kesar) infusion and crushed crunchy pistachios. A festive favorite with rich nutty notes.',
      price: 40,
      ingredients: ['Whole Milk', 'Saffron Strands', 'Crushed Pistachios', 'Green Cardamom', 'Almond Flakes'],
      rating: 4.8,
      reviews: 180,
      color: '#E6F5D0',
      category: 'Nutty'
    },
    {
      name: 'Mango Delight',
      description: 'Crafted with real pulp of sun-ripened Alphonso mangoes blended into rich rabri cream. A refreshing tropical treat.',
      price: 35,
      ingredients: ['Alphonso Mango Pulp', 'Reduced Milk', 'Pistachios', 'Cardamom', 'Fresh Cream'],
      rating: 4.7,
      reviews: 150,
      color: '#FFE599',
      category: 'Fruit'
    },
    {
      name: 'Rose Petal',
      description: 'Infused with sweet fragrant organic rose syrup and real candied rose petals (gulkand). Exquisite floral indulgence.',
      price: 35,
      ingredients: ['Organic Rose Water', 'Gulkand', 'Milk Solids', 'Rose Syrup', 'Pistachios'],
      rating: 4.6,
      reviews: 98,
      color: '#FFD6E8',
      category: 'Premium'
    },
    {
      name: 'Chocolate Almond',
      description: 'A modern twist combining rich dark Dutch cocoa cream with chunks of roasted caramelised almonds. Irresistibly decadent.',
      price: 45,
      ingredients: ['Dark Cocoa Powder', 'Roasted Almonds', 'Condensed Milk', 'Chocolate Chips'],
      rating: 4.8,
      reviews: 112,
      color: '#EFEBE9',
      category: 'Premium'
    }
  ];

  useEffect(() => {
    const fetchKulfis = async () => {
      try {
        const res = await fetch(`${API_URL}/kulfis`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setKulfis(data);
          } else {
            setKulfis(defaultFlavors);
          }
        } else {
          setKulfis(defaultFlavors);
        }
      } catch (err) {
        console.warn('API connection failed, loading local flavors.', err);
        setKulfis(defaultFlavors);
      } finally {
        setLoading(false);
      }
    };

    fetchKulfis();
  }, []);

  const activeKulfi = kulfis[currentIndex] || defaultFlavors[0];

  const handleKulfiClick = () => {
    // Cycle to the next flavor in the list
    setCurrentIndex((prevIndex) => (prevIndex + 1) % kulfis.length);
  };

  const handleOrderClick = () => {
    if (!user) {
      setShowAlert(true);
      // Auto open login dialog after a brief delay
      setTimeout(() => {
        openAuth();
        setShowAlert(false);
      }, 2000);
    } else {
      setView('catalog');
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-left">
        <span className="hero-tag">Traditional Indian Ice Cream</span>
        <h1 className="hero-title">Experience Pure Malai Kulfi</h1>
        <p className="hero-desc">
          Slow-cooked condensed milk frozen into traditional molds. Tap the kulfi on the right to discover our artisanal flavors!
        </p>

        {/* Dynamic Display Card */}
        <div className="details-display-card" style={{ '--kulfi-theme-color': activeKulfi.color }}>
          <div className="card-top">
            <h3 className="flavor-title">{activeKulfi.name}</h3>
            <span className="price-tag">{activeKulfi.price}</span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            {activeKulfi.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#ffb300', marginBottom: '1rem' }}>
            <span>⭐ {activeKulfi.rating} ({activeKulfi.reviews} reviews)</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{activeKulfi.category} Category</span>
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Ingredients:</h4>
          <div className="ingredients-list">
            {activeKulfi.ingredients && activeKulfi.ingredients.map((ing, idx) => (
              <span key={idx} className="ingredient-badge">{ing}</span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleOrderClick}
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
          >
            Order Now &rarr;
          </button>
        </div>

        {/* Prompt alert if guest tries to order */}
        {showAlert && (
          <div className="alert-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Please Sign In to order! Loading login form...</span>
          </div>
        )}
      </div>

      <div className="hero-right">
        <div style={{ textAlign: 'center' }}>
          <InteractiveKulfi 
            color={activeKulfi.color} 
            onClick={handleKulfiClick} 
          />
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            ▲ Click the Kulfi to change flavor details
          </p>
        </div>
      </div>
    </section>
  );
}
