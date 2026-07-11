import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext, API_URL } from '../context/AuthContext';

export default function Checkout({ setView }) {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Card details states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Interaction/Animation states
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const shippingFee = cartTotal > 100 ? 0 : 20;
  const grandTotal = cartTotal + shippingFee;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // numeric only
    // Format card number with spaces (XXXX XXXX XXXX XXXX)
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0,2) + '/' + value.substring(2,4);
    }
    if (value.length <= 5) {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardCvv(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !address || !city || !zipCode) {
      setErrorMessage('Please fill in all shipping fields.');
      return;
    }
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      setErrorMessage('Please fill in card details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: { name, address, city, zipCode }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Order failed');
      }

      // Order created successfully, store details for receipt view
      setOrderReceipt(data);
      clearCart(); // empty cart
    } catch (err) {
      setErrorMessage(err.message || 'Server error. Checkout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Receipt view
  if (orderReceipt) {
    return (
      <div className="cart-container" style={{ maxWidth: '650px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--color-gold)', borderRadius: '16px', padding: '3rem', marginTop: '2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem' }}>🎉</span>
          <h2 style={{ color: 'var(--color-gold)', fontSize: '2.2rem', marginTop: '1rem', fontFamily: 'Playfair Display, serif' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Thank you for ordering with Malai Kulfi. Your receipt is below.</p>
        </div>

        {/* Invoice breakdown */}
        <div style={{ borderTop: '2px dashed rgba(214,175,55,0.3)', borderBottom: '2px dashed rgba(214,175,55,0.3)', padding: '2rem 0', margin: '2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Order ID: <b style={{ color: '#fff' }}>{orderReceipt._id || orderReceipt.id}</b></span>
            <span>Date: <b style={{ color: '#fff' }}>{new Date(orderReceipt.createdAt).toLocaleDateString()}</b></span>
          </div>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Items Ordered:</h3>
          {orderReceipt.items && orderReceipt.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-gold)' }}>
            <span>Total Paid</span>
            <span>₹{orderReceipt.totalAmount}</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Delivery Address:</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.4' }}>
            {orderReceipt.shippingAddress.name}<br />
            {orderReceipt.shippingAddress.address}<br />
            {orderReceipt.shippingAddress.city} - {orderReceipt.shippingAddress.zipCode}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '50%', justifyContent: 'center' }} onClick={() => window.print()}>
            Print Receipt
          </button>
          <button className="btn btn-primary" style={{ width: '50%', justifyContent: 'center' }} onClick={() => setView('catalog')}>
            Order More Flavors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display, serif', color: '#fff' }}>Secure Checkout</h2>
        
        {errorMessage && (
          <div style={{ background: 'rgba(220,53,69,0.1)', color: '#ff6b6b', border: '1px solid rgba(220,53,69,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Shipping Address */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>1. Delivery Address</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="ship-name">Full Name</label>
              <input
                id="ship-name"
                type="text"
                className="form-input"
                required
                placeholder="Receiver name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ship-address">Street Address</label>
              <input
                id="ship-address"
                type="text"
                className="form-input"
                required
                placeholder="Door no, Street name"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ship-city">City</label>
                <input
                  id="ship-city"
                  type="text"
                  className="form-input"
                  required
                  placeholder="City name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ship-zip">Zip Code</label>
                <input
                  id="ship-zip"
                  type="text"
                  className="form-input"
                  required
                  placeholder="600001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>2. Card Payment</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="pay-num">Card Number</label>
              <input
                id="pay-num"
                type="text"
                className="form-input"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onFocus={() => setIsCardFlipped(false)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pay-holder">Card Holder Name</label>
              <input
                id="pay-holder"
                type="text"
                className="form-input"
                placeholder="As printed on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                onFocus={() => setIsCardFlipped(false)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pay-expiry">Expiry Date</label>
                <input
                  id="pay-expiry"
                  type="text"
                  className="form-input"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  onFocus={() => setIsCardFlipped(false)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pay-cvv">CVV</label>
                <input
                  id="pay-cvv"
                  type="password"
                  className="form-input"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={handleCvvChange}
                  onFocus={() => setIsCardFlipped(true)}
                  onBlur={() => setIsCardFlipped(false)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '2.5rem', padding: '1rem' }}
          >
            {isSubmitting ? 'Verifying Card Info...' : `Pay ₹${grandTotal} & Place Order`}
          </button>
        </form>
      </div>

      <div>
        {/* Interactive Visual Card Element */}
        <div className="card-preview-container">
          <div className={`credit-card ${isCardFlipped ? 'flipped' : ''}`}>
            {/* Front of card */}
            <div className="card-face">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-chip"></div>
                <div className="card-logo">Malai Pay</div>
              </div>
              <div className="card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
              <div className="card-details">
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>Card Holder</div>
                  <div>{cardName || 'YOUR FULL NAME'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>Expires</div>
                  <div>{cardExpiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>
            {/* Back of card */}
            <div className="card-face card-face-back">
              <div className="card-stripe"></div>
              <div style={{ marginTop: '1.25rem', padding: '0 1rem', fontSize: '0.65rem', opacity: 0.6 }}>CVV / CVC SECURITY CODE</div>
              <div className="card-signature-area">
                {cardCvv || '•••'}
              </div>
              <div style={{ padding: '0.75rem 1.5rem 1.5rem 1.5rem', fontSize: '0.55rem', opacity: 0.4 }}>
                This is a simulated interactive credit card component. Do not input real credit card credentials.
              </div>
            </div>
          </div>
        </div>

        {/* Order review */}
        <div style={{ background: 'var(--bg-dark-secondary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#fff' }}>Review Order Items</h3>
          <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Cart Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--color-gold)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
