import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../context/AuthContext';

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'orders'
  const [kulfis, setKulfis] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Null for create
  const [flavorName, setFlavorName] = useState('');
  const [flavorDesc, setFlavorDesc] = useState('');
  const [flavorPrice, setFlavorPrice] = useState('');
  const [flavorColor, setFlavorColor] = useState('#FFF9E6');
  const [flavorIng, setFlavorIng] = useState('');
  const [flavorCategory, setFlavorCategory] = useState('Classic');
  const [flavorStock, setFlavorStock] = useState('10');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'catalog') {
        const res = await fetch(`${API_URL}/kulfis`);
        if (res.ok) {
          const data = await res.json();
          setKulfis(data);
        }
      } else {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFlavorName('');
    setFlavorDesc('');
    setFlavorPrice('');
    setFlavorColor('#FFF9E6');
    setFlavorIng('');
    setFlavorCategory('Classic');
    setFlavorStock('10');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (kulfi) => {
    setEditId(kulfi._id);
    setFlavorName(kulfi.name);
    setFlavorDesc(kulfi.description);
    setFlavorPrice(kulfi.price.toString());
    setFlavorColor(kulfi.color);
    setFlavorIng(kulfi.ingredients.join(', '));
    setFlavorCategory(kulfi.category);
    setFlavorStock(kulfi.stock.toString());
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this kulfi flavor?')) return;
    try {
      const res = await fetch(`${API_URL}/kulfis/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Delete request failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flavorName || !flavorDesc || !flavorPrice || !flavorColor) {
      alert('Please fill in name, description, price, and color.');
      return;
    }

    const payload = {
      name: flavorName,
      description: flavorDesc,
      price: Number(flavorPrice),
      color: flavorColor,
      ingredients: flavorIng,
      category: flavorCategory,
      stock: Number(flavorStock)
    };

    const url = editId ? `${API_URL}/kulfis/${editId}` : `${API_URL}/kulfis`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Operation failed');
      }
    } catch (err) {
      alert('Submit failed.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Network error while updating status');
    }
  };

  const renderMiniSVG = (color) => {
    return (
      <svg width="25" height="35" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 90 C40 90 40 140 40 140 C40 143 45 147 50 147 C55 147 60 143 60 140 C60 140 60 90 60 90 Z" fill="#d2b48c" stroke="#aa7c11" strokeWidth="2" />
        <path d="M20 20 C20 20 15 22 15 30 L18 95 C18 100 25 102 50 102 C75 102 82 100 82 95 L85 30 C85 22 80 20 80 20 L20 20 Z" fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      </svg>
    );
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return '#ffd15c';
    if (status === 'Preparing') return '#ffa500';
    if (status === 'Out for Delivery') return '#00bfff';
    return '#2ec4b6'; // Delivered
  };

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', color: '#fff', fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage products catalog and monitor client orders.</p>
        </div>
        
        {activeTab === 'catalog' && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            + Add New Flavor
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Kulfi Catalog
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders Tracker
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-gold)' }}>
          <h3>Fetching admin details...</h3>
        </div>
      ) : activeTab === 'catalog' ? (
        /* Catalog Table */
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Flavor Name</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Ingredients</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kulfis.map((kulfi) => (
                <tr key={kulfi._id}>
                  <td>{renderMiniSVG(kulfi.color)}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{kulfi.name}</td>
                  <td>{kulfi.category}</td>
                  <td style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>₹{kulfi.price}</td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {kulfi.ingredients.join(', ')}
                  </td>
                  <td>
                    <span style={{ color: kulfi.stock <= 5 ? '#ff4d4d' : '#fff' }}>
                      {kulfi.stock} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleOpenEdit(kulfi)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(kulfi._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Orders Table */
        <div style={{ overflowX: 'auto' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              No orders placed yet.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Address</th>
                  <th>Items Ordered</th>
                  <th>Total Price</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order._id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{order.shippingAddress.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {order.user}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{order.shippingAddress.address}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.shippingAddress.city} - {order.shippingAddress.zipCode}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            • {item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                      ₹{order.totalAmount}
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          background: 'var(--bg-dark-tertiary)',
                          border: `1px solid ${getStatusColor(order.orderStatus)}`,
                          color: getStatusColor(order.orderStatus),
                          padding: '0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CRUD Form dialog */}
      {isFormOpen && (
        <dialog 
          open 
          closedby="any"
          onClose={() => setIsFormOpen(false)}
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
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>
              {editId ? 'Modify Kulfi Flavor' : 'Create Kulfi Flavor'}
            </h3>
            <button className="dialog-close-btn" onClick={() => setIsFormOpen(false)}>&times;</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="form-name">Flavor Name</label>
              <input
                id="form-name"
                type="text"
                className="form-input"
                required
                placeholder="Classic Malai"
                value={flavorName}
                onChange={(e) => setFlavorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-desc">Description</label>
              <textarea
                id="form-desc"
                className="form-input"
                required
                rows="3"
                placeholder="Slow-cooked milk frozen with saffron..."
                style={{ resize: 'vertical' }}
                value={flavorDesc}
                onChange={(e) => setFlavorDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-price">Price (INR)</label>
                <input
                  id="form-price"
                  type="number"
                  className="form-input"
                  required
                  min="0"
                  placeholder="30"
                  value={flavorPrice}
                  onChange={(e) => setFlavorPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-category">Category</label>
                <select
                  id="form-category"
                  className="filter-select"
                  style={{ width: '100%', height: '47px' }}
                  value={flavorCategory}
                  onChange={(e) => setFlavorCategory(e.target.value)}
                >
                  <option value="Classic">Classic</option>
                  <option value="Nutty">Nutty</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-color">Flavor Color (Hex)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    id="form-color"
                    type="color"
                    style={{ background: 'none', border: 'none', width: '36px', height: '36px', cursor: 'pointer' }}
                    value={flavorColor}
                    onChange={(e) => setFlavorColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ flexGrow: 1, padding: '0.5rem' }}
                    value={flavorColor}
                    onChange={(e) => setFlavorColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-stock">Stock Units</label>
                <input
                  id="form-stock"
                  type="number"
                  className="form-input"
                  required
                  min="0"
                  placeholder="10"
                  value={flavorStock}
                  onChange={(e) => setFlavorStock(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="form-ing">Ingredients (Comma separated)</label>
              <input
                id="form-ing"
                type="text"
                className="form-input"
                placeholder="Heavy Cream, Cardamom, Saffron"
                value={flavorIng}
                onChange={(e) => setFlavorIng(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-secondary" style={{ width: '50%', justifyContent: 'center' }} onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ width: '50%', justifyContent: 'center' }}>
                Save Flavor
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
