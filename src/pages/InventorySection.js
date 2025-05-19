import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReceiptUpload from './ReceiptUpload';
import ExtractedItemsModal from './ExtractedItemsModal';
import { BASE_URL } from '../utils/api';

Modal.setAppElement('#root');

function InventorySection({ groupName }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [confirmFinishModalOpen, setConfirmFinishModalOpen] = useState(false);
  const [itemToFinish, setItemToFinish] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (groupName) {
      fetch(`${BASE_URL}/api/inventory/${groupName}`)
        .then(res => res.json())
        .then(data => setInventoryItems(data))
        .catch(err => console.error('Error fetching inventory:', err));
    }
  }, [groupName]);

  const reloadInventory = async () => {
    const res = await fetch(`${BASE_URL}/api/inventory/${groupName}`);
    const data = await res.json();
    setInventoryItems(data);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = localStorage.getItem('loggedInUsername');
    const expiryDateValue = formData.get('expiryDate');

      if (expiryDateValue) {
    const selectedDate = new Date(expiryDateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of day

    if (selectedDate < today) {
      alert("Expiry date cannot be in the past.");
      return;
    }
  }
    const params = new URLSearchParams({
      groupName,
      username,
      itemName: formData.get('itemName'),
      quantity: formData.get('quantity'),
      unit: formData.get('unit'),
    });

  if (expiryDateValue) {
    params.append('expiryDate', expiryDateValue);
  }
    // if (formData.get('expiryDate')) params.append('expiryDate', formData.get('expiryDate'));

    const res = await fetch(`${BASE_URL}/api/inventory/add?${params.toString()}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('Item added!');
      e.target.reset();
      reloadInventory();
    } else {
      const err = await res.text();
      alert('Error: ' + err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const res = await fetch(`${BASE_URL}/api/inventory/delete/${itemId}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Item deleted.');
      reloadInventory();
    } else {
      alert('Failed to delete.');
    }
  };

  const handleMarkFinished = (item) => {
    setItemToFinish(item);
    setConfirmFinishModalOpen(true);
  };

  const confirmMarkFinished = async () => {
    const addToShopping = window.confirm("Do you want to add this item to the shopping list?") ? "true" : "false";
    const res = await fetch(`${BASE_URL}/api/inventory/finish/${itemToFinish.itemId}?addToShopping=${addToShopping}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert("Item marked as finished.");
      reloadInventory();
    } else {
      alert("Failed to update item.");
    }

    setConfirmFinishModalOpen(false);
    setItemToFinish(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { itemId } = editItem;

    const res = await fetch(`${BASE_URL}/api/inventory/update/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName: formData.get('itemName'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
        expiryDate: formData.get('expiryDate') || null
      }),
    });

    if (res.ok) {
      alert('Item updated!');
      setEditItem(null);
      reloadInventory();
    } else {
      const error = await res.text();
      alert('Update failed: ' + error);
    }
  };

  const handleReceiptExtracted = (items) => {
    setReceiptItems(items);
    setReceiptModalOpen(true);
  };

  const confirmAddExtractedItems = async (finalItems) => {
    const username = localStorage.getItem('loggedInUsername');
    for (const item of finalItems) {
      const params = new URLSearchParams({
        groupName,
        username,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit
      });
      await fetch(`${BASE_URL}/api/inventory/add?${params.toString()}`, { method: 'POST' });
    }
    alert('Extracted items added to inventory!');
    reloadInventory();
    setReceiptModalOpen(false);
  };

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#333' }}>📦 Inventory Items</h3>

      <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input name="itemName" placeholder="Item Name" required style={inputStyle} />
        <input name="quantity" type="number" placeholder="Quantity" required style={inputStyle} />
        <input name="unit" placeholder="Unit" required style={inputStyle} />
        <input
          name="expiryDate"
          type="text"
          placeholder="Expiry Date(Optional)"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
          style={inputStyle}
        />
        <button type="submit" style={submitButton}>➕ Add</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <ReceiptUpload onExtracted={handleReceiptExtracted} />
      </div>

      {inventoryItems.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {inventoryItems.map(item => (
            <li key={item.itemId} style={itemCard}>
              <div>
                <strong>{item.itemName}</strong> — {item.quantity} {item.unit}
                {item.expiryDate ? ` (expires on ${item.expiryDate})` : ''}
              </div>
              <div style={buttonGroup}>
                <button onClick={() => setEditItem(item)} style={smallButton}>✏️</button>
                <button onClick={() => handleDelete(item.itemId)} style={smallButton}>🗑️</button>
                <button onClick={() => handleMarkFinished(item)} style={smallButton}>✅</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#666' }}>No items in inventory.</p>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editItem}
        onRequestClose={() => setEditItem(null)}
        contentLabel="Edit Item"
        style={modalStyle}
      >
        {editItem && (
          <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Item</h2>
            <input name="itemName" defaultValue={editItem.itemName} required style={inputStyle} />
            <input name="quantity" type="number" defaultValue={editItem.quantity} required style={inputStyle} />
            <input name="unit" defaultValue={editItem.unit} required style={inputStyle} />
            <input name="expiryDate" type="date" defaultValue={editItem.expiryDate || ''} style={inputStyle} />
            <div style={buttonGroup}>
              <button type="submit" style={submitButton}>Save</button>
              <button type="button" onClick={() => setEditItem(null)} style={cancelButton}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Finish Modal */}
      <Modal
        isOpen={confirmFinishModalOpen}
        onRequestClose={() => setConfirmFinishModalOpen(false)}
        contentLabel="Confirm Finish"
        style={modalStyle}
      >
        <h2 style={{ textAlign: 'center' }}>Mark this item as finished?</h2>
        <div style={buttonGroup}>
          <button onClick={confirmMarkFinished} style={submitButton}>Yes</button>
          <button onClick={() => setConfirmFinishModalOpen(false)} style={cancelButton}>No</button>
        </div>
      </Modal>

      <ExtractedItemsModal
        isOpen={receiptModalOpen}
        items={receiptItems}
        onConfirm={confirmAddExtractedItems}
        onCancel={() => setReceiptModalOpen(false)}
      />
    </div>
  );
}

export default InventorySection;

const inputStyle = {
  padding: '10px',
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


