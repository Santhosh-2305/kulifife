import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#121212',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      marginTop: '4rem',
      color: '#808080',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ color: '#d4af37', fontWeight: '600', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
          Malai Kulfi Artistry
        </p>
        <p>Slow-churned, rich milk solids infused with the finest traditional Indian aromatics.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} Malai Kulfi Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
