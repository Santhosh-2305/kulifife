import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('kulfi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kulfi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (kulfi, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.kulfiId === kulfi._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          kulfiId: kulfi._id,
          name: kulfi.name,
          price: kulfi.price,
          color: kulfi.color,
          quantity
        }
      ];
    });
  };

  const removeFromCart = (kulfiId) => {
    setCartItems((prev) => prev.filter((item) => item.kulfiId !== kulfiId));
  };

  const updateQuantity = (kulfiId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(kulfiId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.kulfiId === kulfiId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
