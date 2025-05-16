import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

function ExtractedItemsModal({ isOpen, items, onConfirm, onCancel }) {
  const [editableItems, setEditableItems] = useState([]);

  useEffect(() => {
    setEditableItems(items.map(item => ({ ...item })));
  }, [items]);

  const handleChange = (index, field, value) => {
    const updated = [...editableItems];
    updated[index][field] = field === 'quantity' ? parseInt(value) : value;
    setEditableItems(updated);
  };

  const handleRemove = (index) => {
    const updated = [...editableItems];
    updated.splice(index, 1);
    setEditableItems(updated);
  };

  const handleConfirm = () => {
    const validItems = editableItems.filter(item => item.itemName && item.quantity > 0);
    onConfirm(validItems);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirm Extracted Items"
      style={{
        content: {
          maxWidth: '90%',
          width: '100%',
          maxHeight: '90vh',        // ✅ Restrict modal height
          overflowY: 'auto',
          margin: 'auto',
          borderRadius: '12px',
          padding: '20px',
          inset: '50% auto auto 50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Arial, sans-serif',
        }
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>🧾 Review & Edit Extracted Items</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {editableItems.map((item, index) => (
          <div key={index} style={{
            backgroundColor: '#f9f9ff',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <input
              value={item.itemName}
              onChange={e => handleChange(index, 'itemName', e.target.value)}
              placeholder="Item Name"
              required
              style={inputStyle}
            />
            <input
              type="number"
              value={item.quantity}
              min={1}
              onChange={e => handleChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              required
              style={inputStyle}
            />
            <input
              value={item.unit}
              onChange={e => handleChange(index, 'unit', e.target.value)}
              placeholder="Unit (e.g. kg)"
              required
              style={inputStyle}
            />
            <button
              onClick={() => handleRemove(index)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'red',
                fontSize: '0.9rem',
                alignSelf: 'flex-end',
                cursor: 'pointer'
              }}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', gap: '10px' }}>
        <button onClick={handleConfirm} style={confirmButton}>✅ Confirm & Add</button>
        <button onClick={onCancel} style={cancelButton}>❎ Cancel</button>
      </div>
    </Modal>
  );
}

export default ExtractedItemsModal;

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box'
};

const confirmButton = {
  flex: 1,
  backgroundColor: '#4a6ee0',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const cancelButton = {
  flex: 1,
  backgroundColor: '#ccc',
  color: '#333',
  border: 'none',
  borderRadius: '8px',
  padding: '12px',
  fontWeight: 'bold',
  cursor: 'pointer'
};


