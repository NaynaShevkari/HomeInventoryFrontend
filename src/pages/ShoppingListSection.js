import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { BASE_URL } from '../utils/api';

Modal.setAppElement('#root');

function ShoppingListSection({ groupName }) {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showBoughtModal, setShowBoughtModal] = useState(false);
  const [itemToBuy, setItemToBuy] = useState(null);

  const fetchShoppingItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/shopping/${groupName}`);
      const data = await res.json();
      setShoppingItems(data);
    } catch (err) {
      console.error('Error fetching shopping items:', err);
    }
  };

  useEffect(() => {
    if (groupName) {
      fetchShoppingItems();
    }
  }, [groupName]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemName = formData.get('itemName');
    const quantity = formData.get('quantity');
    const unit = formData.get('unit');
    const username = localStorage.getItem('loggedInUsername');

    const params = new URLSearchParams({
      groupName,
      username,
      itemName,
      quantity,
      unit,
    });

    const res = await fetch(`${BASE_URL}/api/shopping/add?${params.toString()}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('Item added to shopping list');
      e.target.reset();
      fetchShoppingItems();
    } else {
      const err = await res.text();
      alert('Error: ' + err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const res = await fetch(`${BASE_URL}/api/shopping/delete/${itemId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Item deleted');
      fetchShoppingItems();
    } else {
      alert('Failed to delete item');
    }
  };

  const handleMarkAsBought = (item) => {
    setItemToBuy(item);
    setShowBoughtModal(true);
  };

  const confirmMarkAsBought = async () => {
    if (!itemToBuy) return;
    const res = await fetch(`${BASE_URL}/api/shopping/bought/${itemToBuy.shoppingItemId}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('Item moved to inventory');
      fetchShoppingItems();
    } else {
      alert('Failed to mark as bought');
    }
    setShowBoughtModal(false);
    setItemToBuy(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch(
      `${BASE_URL}/api/shopping/update/${editItem.shoppingItemId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: formData.get('itemName'),
          quantity: formData.get('quantity'),
          unit: formData.get('unit'),
        }),
      }
    );

    if (res.ok) {
      alert('Item updated!');
      setEditItem(null);
      fetchShoppingItems();
    } else {
      const err = await res.text();
      alert('Update failed: ' + err);
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#333' }}>🛒 Shopping List</h3>

      {/* Add Item Form */}
      <form 
        onSubmit={handleAddItem} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        <input name="itemName" placeholder="Item name" required style={inputStyle} />
        <input name="quantity" type="number" placeholder="Qty" required style={inputStyle} />
        <input name="unit" placeholder="Unit (e.g. kg, pcs)" required style={inputStyle} />
        <button type="submit" style={submitButton}>➕ Add</button>
      </form>

      {/* Shopping Items List */}
      {shoppingItems.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {shoppingItems.map((item) => (
            <li key={item.shoppingItemId} style={itemCard}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {item.itemName} — {item.quantity} {item.unit}
              </div>
              <div style={buttonGroup}>
                <button onClick={() => setEditItem(item)} style={smallButton}>✏️</button>
                <button onClick={() => handleDelete(item.shoppingItemId)} style={smallButton}>🗑️</button>
                <button onClick={() => handleMarkAsBought(item)} style={smallButton}>✅</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#666' }}>No items in shopping list.</p>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editItem}
        onRequestClose={() => setEditItem(null)}
        contentLabel="Edit Shopping Item"
        style={modalStyle}
      >
        {editItem && (
          <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Item</h2>
            <input name="itemName" defaultValue={editItem.itemName} required style={inputStyle} />
            <input name="quantity" type="number" defaultValue={editItem.quantity} required style={inputStyle} />
            <input name="unit" defaultValue={editItem.unit || ''} placeholder="Unit" required style={inputStyle} />
            <div style={buttonGroup}>
              <button type="submit" style={submitButton}>Save</button>
              <button type="button" onClick={() => setEditItem(null)} style={cancelButton}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Mark as Bought Modal */}
      <Modal
        isOpen={showBoughtModal}
        onRequestClose={() => setShowBoughtModal(false)}
        contentLabel="Confirm Mark as Bought"
        style={modalStyle}
      >
        <h2 style={{ textAlign: 'center' }}>Move item to inventory?</h2>
        <div style={buttonGroup}>
          <button onClick={confirmMarkAsBought} style={submitButton}>Yes</button>
          <button onClick={() => setShowBoughtModal(false)} style={cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default ShoppingListSection;

const inputStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box'
};

const submitButton = {
  padding: '10px',
  backgroundColor: '#4a6ee0',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  flex: 1
};

const cancelButton = {
  ...submitButton,
  backgroundColor: '#ccc',
  color: '#333'
};

const itemCard = {
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#f9f9ff',
  border: '1px solid #ddd',
  marginBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const buttonGroup = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap'
};

const smallButton = {
  flex: 1,
  padding: '8px',
  fontSize: '0.9rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#eee'
};

const modalStyle = {
  content: {
    maxWidth: '90%',
    width: '100%',
    padding: '20px',
    borderRadius: '12px',
    margin: 'auto',
    inset: '50% auto auto 50%',
    transform: 'translate(-50%, -50%)'
  }
};



