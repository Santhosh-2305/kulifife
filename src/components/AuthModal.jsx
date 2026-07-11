import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, register, error, setError } = useContext(AuthContext);

  // Sync open/close state of standard dialog element
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setLocalError('');
      setError(null);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, setError]);

  // Implement light-dismiss fallback for browsers without native support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isDialogContent) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  // Clean form input states
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setLocalError('');
    setError(null);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (mode === 'register' && !name) {
      setLocalError('Please enter your name.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      resetForm();
      onClose(); // Close modal on success
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <dialog 
      ref={dialogRef} 
      closedby="any" 
      onClose={onClose}
      aria-labelledby="auth-title"
    >
      <div className="dialog-header">
        <h2 id="auth-title" style={{ color: 'var(--color-gold)' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <button className="dialog-close-btn" onClick={onClose} aria-label="Close dialog">
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {localError && (
          <div style={{ color: '#ff6b6b', background: 'rgba(220,53,69,0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {localError}
          </div>
        )}

        {mode === 'register' && (
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            type="email"
            className="form-input"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
        >
          {mode === 'login' ? 'Sign In & Order Now' : 'Sign Up'}
        </button>
      </form>

      <div className="form-footer">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
              Sign Up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
              Sign In
            </a>
          </>
        )}
      </div>
    </dialog>
  );
}
