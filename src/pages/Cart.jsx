import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Cart({ setView, openAuth }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const shippingFee = cartTotal > 100 || cartTotal === 0 ? 0 : 20;
  const grandTotal = cartTotal + shippingFee;

  const handleCheckoutClick = () => {
    if (!user) {
      openAuth();
    } else {
      setView('checkout');
    }
  };

  const renderProductSVG = (color) => {
    return (
      <svg width="40" height="60" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 90 C40 90 40 140 40 140 C40 143 45 147 50 147 C55 147 60 143 60 140 C60 140 60 90 60 90 Z" fill="#d2b48c" stroke="#aa7c11" strokeWidth="1.5" />
        <path d="M20 20 C20 20 15 22 15 30 L18 95 C18 100 25 102 50 102 C75 102 82 100 82 95 L85 30 C85 22 80 20 80 20 L20 20 Z" fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      </svg>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added any sweet treats yet.</p>
        <button className="btn btn-primary" onClick={() => setView('catalog')}>
          Browse Kulfi Flavors
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      
      <div>
        {cartItems.map((item) => (
          <div key={item.kulfiId} className="cart-item">
            <div className="cart-item-image">
              {renderProductSVG(item.color)}
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{item.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>₹{item.price} each</p>
            </div>

            <div className="cart-qty-ctrl">
              <button className="qty-btn" onClick={() => updateQuantity(item.kulfiId, item.quantity - 1)}>-</button>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button className="qty-btn" onClick={() => updateQuantity(item.kulfiId, item.quantity + 1)}>+</button>
            </div>

            <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.1rem' }}>
              ₹{item.price * item.quantity}
            </div>

            <button 
              onClick={() => removeFromCart(item.kulfiId)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6b6b',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0.5rem'
              }}
              title="Remove Item"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Order Summary</h3>
        
        <div className="summary-row">
          <span>Subtotal</span>
          <span style={{ color: '#fff' }}>₹{cartTotal}</span>
        </div>
        
        <div className="summary-row">
          <span>Shipping Fee</span>
          {shippingFee === 0 ? (
            <span style={{ color: '#2ec4b6' }}>FREE</span>
          ) : (
            <span style={{ color: '#fff' }}>₹{shippingFee}</span>
          )}
        </div>

        {shippingFee > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            Add ₹{100 - cartTotal} more for FREE shipping!
          </p>
        )}

        <div className="summary-row summary-total">
          <span>Total Amount</span>
          <span>₹{grandTotal}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => setView('catalog')}>
            Continue Shopping
          </button>
          <button className="btn btn-primary" onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
