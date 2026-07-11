import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext, API_URL } from '../context/AuthContext';

export default function Catalog() {
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const [kulfis, setKulfis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'price-asc', 'price-desc', 'rating'
  
  // Feedback states
  const [addedItem, setAddedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchKulfis = async () => {
      try {
        const res = await fetch(`${API_URL}/kulfis`);
        if (res.ok) {
          const data = await res.json();
          setKulfis(data);
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKulfis();
  }, []);

  const handleAddToCart = (e, kulfi) => {
    e.stopPropagation(); // Avoid opening quick view
    addToCart(kulfi, 1);
    setAddedItem(kulfi._id);
    setTimeout(() => setAddedItem(null), 1000);
  };

  // Compile filter and sort results
  const filteredKulfis = kulfis
    .filter((k) => {
      const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || 
                          k.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || k.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  // Render mini SVG representation inside catalog card
  const renderProductSVG = (color, name) => {
    return (
      <svg className="product-image-svg" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 90 C40 90 40 140 40 140 C40 143 45 147 50 147 C55 147 60 143 60 140 C60 140 60 90 60 90 Z" fill="#d2b48c" stroke="#aa7c11" strokeWidth="1.5" />
        <path d="M20 20 C20 20 15 22 15 30 L18 95 C18 100 25 102 50 102 C75 102 82 100 82 95 L85 30 C85 22 80 20 80 20 L20 20 Z" fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <line x1="32" y1="25" x2="36" y2="92" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <line x1="50" y1="25" x2="50" y2="95" stroke="rgba(0,0,0,0.12)" strokeWidth="2.0" strokeLinecap="round" opacity="0.35" />
        <line x1="68" y1="25" x2="64" y2="92" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </svg>
    );
  };

  return (
    <div className="catalog-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem' }}>Our Kulfi Collection</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Explore traditional, handcrafted flavors made with 100% natural ingredients.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="catalog-header">
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="Search flavors, descriptions..."
              style={{ width: '100%', paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          </div>

          <select 
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Classic">Classic</option>
            <option value="Nutty">Nutty</option>
            <option value="Fruit">Fruit</option>
            <option value="Premium">Premium</option>
          </select>

          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by: Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-gold)' }}>
          <h3>Preparing the Catalog...</h3>
        </div>
      ) : filteredKulfis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <h3>No kulfi flavors found matching your criteria.</h3>
        </div>
      ) : (
        <div className="kulfi-grid">
          {filteredKulfis.map((kulfi) => (
            <div 
              key={kulfi._id} 
              className="product-card"
              onClick={() => setSelectedProduct(kulfi)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-container">
                {renderProductSVG(kulfi.color, kulfi.name)}
                <span className="product-badge">{kulfi.category}</span>
              </div>

              <div className="product-info">
                <span className="product-category">Pure Handcrafted</span>
                <h3 className="product-name">{kulfi.name}</h3>
                
                <div className="product-rating">
                  <span className="stars">{'★'.repeat(Math.round(kulfi.rating)) + '☆'.repeat(5 - Math.round(kulfi.rating))}</span>
                  <span>({kulfi.reviews || 0})</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {kulfi.description}
                </p>

                {/* Stock warning */}
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  {kulfi.stock <= 0 ? (
                    <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Out of stock</span>
                  ) : kulfi.stock <= 5 ? (
                    <span style={{ color: '#ff9900', fontWeight: 'bold' }}>Only {kulfi.stock} left in stock - order soon.</span>
                  ) : (
                    <span style={{ color: '#2ec4b6' }}>In Stock</span>
                  )}
                </div>

                <div className="product-price-section">
                  <span className="product-price">{kulfi.price}</span>
                  <button 
                    className="btn btn-primary"
                    disabled={kulfi.stock <= 0}
                    onClick={(e) => handleAddToCart(e, kulfi)}
                    style={{ 
                      padding: '0.5rem 1.25rem', 
                      fontSize: '0.85rem',
                      background: addedItem === kulfi._id ? '#2ec4b6' : 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                      color: addedItem === kulfi._id ? '#fff' : '#000'
                    }}
                  >
                    {addedItem === kulfi._id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Dialog / Slide-out */}
      {selectedProduct && (
        <dialog 
          open 
          closedby="any"
          onClose={() => setSelectedProduct(null)}
          style={{
            position: 'fixed',
            margin: 'auto',
            top: 0, bottom: 0, left: 0, right: 0,
            maxWidth: '500px',
            border: '1px solid rgba(214,175,55,0.3)',
            zIndex: 1000
          }}
        >
          <div className="dialog-header">
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.75rem' }}>{selectedProduct.name}</h3>
            <button className="dialog-close-btn" onClick={() => setSelectedProduct(null)}>&times;</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              {renderProductSVG(selectedProduct.color, selectedProduct.name)}
            </div>
            
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Product Description</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedProduct.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>₹{selectedProduct.price}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category</h4>
                <p style={{ fontSize: '1.1rem' }}>{selectedProduct.category}</p>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ingredients List</h4>
              <div className="ingredients-list">
                {selectedProduct.ingredients && selectedProduct.ingredients.map((ing, idx) => (
                  <span key={idx} className="ingredient-badge" style={{ background: 'rgba(214,175,55,0.08)' }}>{ing}</span>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-primary"
              disabled={selectedProduct.stock <= 0}
              onClick={(e) => { handleAddToCart(e, selectedProduct); setSelectedProduct(null); }}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              Add to Shopping Cart
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
