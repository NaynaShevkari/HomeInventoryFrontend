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
    updated.splice(index, 1); // remove the item at the index
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
      style={{ content: { width: '500px', margin: 'auto' } }}
    >
      <h3>Review & Edit Extracted Items</h3>
      {editableItems.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            value={item.itemName}
            onChange={e => handleChange(index, 'itemName', e.target.value)}
            style={{ width: '60%' }}
          />
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={e => handleChange(index, 'quantity', e.target.value)}
            style={{ width: '20%', marginLeft: '10px' }}
          />
          <input
            value={item.unit}
            onChange={e => handleChange(index, 'unit', e.target.value)}
            style={{ width: '15%', marginLeft: '10px' }}
          />
            <button onClick={() => handleRemove(index)} style={{ marginLeft: '10px', color: 'red' }}>
              ❌
            </button>
        </div>
      ))}
      <button onClick={handleConfirm} style={{ marginRight: '10px' }}>Confirm & Add</button>
      <button onClick={onCancel}>Cancel</button>
    </Modal>
  );
}

export default ExtractedItemsModal;

