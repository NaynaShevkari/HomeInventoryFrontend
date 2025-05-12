// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';

// Modal.setAppElement('#root');

// function InventorySection({ groupName }) {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [editItem, setEditItem] = useState(null);

//   useEffect(() => {
//     if (groupName) {
//       fetch(`http://localhost:8080/api/inventory/${groupName}`)
//         .then(res => res.json())
//         .then(data => setInventoryItems(data))
//         .catch(err => console.error('Error fetching inventory:', err));
//     }
//   }, [groupName]);

//   const reloadInventory = async () => {
//     const res = await fetch(`http://localhost:8080/api/inventory/${groupName}`);
//     const data = await res.json();
//     setInventoryItems(data);
//   };

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const itemName = formData.get('itemName');
//     const quantity = formData.get('quantity');
//     const unit = formData.get('unit');
//     const expiryDate = formData.get('expiryDate');
//     const username = localStorage.getItem('loggedInUsername');

//     const params = new URLSearchParams({
//       groupName,
//       username,
//       itemName,
//       quantity,
//       unit,
//     });
//     if (expiryDate) params.append('expiryDate', expiryDate);

//     const res = await fetch(`http://localhost:8080/api/inventory/add?${params.toString()}`, {
//       method: 'POST',
//     });

//     if (res.ok) {
//       alert('Item added!');
//       e.target.reset();
//       reloadInventory();
//     } else {
//       const err = await res.text();
//       alert('Error: ' + err);
//     }
//   };

//   const handleDelete = async (itemId) => {
//     const confirm = window.confirm('Are you sure you want to delete this item?');
//     if (!confirm) return;

//     const res = await fetch(`http://localhost:8080/api/inventory/delete/${itemId}`, { method: 'DELETE' });
//     if (res.ok) {
//       alert('Item deleted.');
//       reloadInventory();
//     } else {
//       alert('Failed to delete.');
//     }
//   };

//   const handleMarkFinished = async (item) => {
//     const first = window.confirm("Are you sure you want to mark this item as finished?");
//     if (!first) return;

//     const second = window.confirm("Do you want to add this item to the shopping list?");
//     const addToShopping = second ? "true" : "false";

//     const res = await fetch(`http://localhost:8080/api/inventory/finish/${item.itemId}?addToShopping=${addToShopping}`, {
//       method: 'DELETE'
//     });

//     if (res.ok) {
//       alert("Item marked as finished.");
//       reloadInventory();
//     } else {
//       alert("Failed to update item.");
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const { itemId } = editItem;

//     const res = await fetch(`http://localhost:8080/api/inventory/update/${itemId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         itemName: formData.get('itemName'),
//         quantity: formData.get('quantity'),
//         unit: formData.get('unit'),
//         expiryDate: formData.get('expiryDate') || null
//       }),
//     });

//     if (res.ok) {
//       alert('Item updated!');
//       setEditItem(null);
//       reloadInventory();
//     } else {
//       const error = await res.text();
//       alert('Update failed: ' + error);
//     }
//   };

//   return (
//     <div style={{ marginTop: '20px' }}>
//       <h3>📦 Inventory Items</h3>

//       <form onSubmit={handleAddItem} style={{ marginBottom: '30px' }}>
//         <input name="itemName" placeholder="Item Name" required />
//         <input name="quantity" type="number" placeholder="Quantity" required style={{ width: '70px' }} />
//         <input name="unit" placeholder="Unit" required />
//         {/* <input name="expiryDate" placeholder="Expiry Date" type="date" /> */}
//         <input
//   name="expiryDate"
//   type="text"
//   placeholder="Expiry Date"
//   onFocus={(e) => (e.target.type = "date")}
//   onBlur={(e) => {
//     if (!e.target.value) e.target.type = "text";
//   }}
//   style={{ marginRight: '8px' }}
// />

//         <button type="submit">Add</button>
//       </form>

//       {inventoryItems.length > 0 ? (
//         <ul>
//           {inventoryItems.map(item => (
//             <li key={item.itemId} style={{ marginBottom: '10px' }}>
//               {item.itemName} — {item.quantity} {item.unit}
//               {item.expiryDate ? ` (expires on ${item.expiryDate})` : ''}

//               <button onClick={() => setEditItem(item)} style={{ marginLeft: '10px' }}>Update</button>
//               <button onClick={() => handleDelete(item.itemId)} style={{ marginLeft: '10px' }}>Delete</button>
//               <button onClick={() => handleMarkFinished(item)} style={{ marginLeft: '10px' }}>Mark Finished</button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No items in inventory.</p>
//       )}

//       <Modal
//         isOpen={!!editItem}
//         onRequestClose={() => setEditItem(null)}
//         contentLabel="Edit Item"
//         style={{ content: { width: '400px', margin: 'auto' } }}
//       >
//         {editItem && (
//           <form onSubmit={handleUpdateSubmit}>
//             <h2>Edit Item</h2>
//             <input name="itemName" defaultValue={editItem.itemName} required />
//             <input name="quantity" type="number" defaultValue={editItem.quantity} required />
//             <input name="unit" defaultValue={editItem.unit} required />
//             <input name="expiryDate" type="date" defaultValue={editItem.expiryDate || ''} />
//             <button type="submit" style={{ marginRight: '10px' }}>Save</button>
//             <button type="button" onClick={() => setEditItem(null)}>Cancel</button>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default InventorySection;

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function InventorySection({ groupName }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [confirmFinishModalOpen, setConfirmFinishModalOpen] = useState(false);
  const [itemToFinish, setItemToFinish] = useState(null);

  useEffect(() => {
    if (groupName) {
      fetch(`http://localhost:8080/api/inventory/${groupName}`)
        .then(res => res.json())
        .then(data => setInventoryItems(data))
        .catch(err => console.error('Error fetching inventory:', err));
    }
  }, [groupName]);

  const reloadInventory = async () => {
    const res = await fetch(`http://localhost:8080/api/inventory/${groupName}`);
    const data = await res.json();
    setInventoryItems(data);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemName = formData.get('itemName');
    const quantity = formData.get('quantity');
    const unit = formData.get('unit');
    const expiryDate = formData.get('expiryDate');
    const username = localStorage.getItem('loggedInUsername');

    const params = new URLSearchParams({
      groupName,
      username,
      itemName,
      quantity,
      unit,
    });
    if (expiryDate) params.append('expiryDate', expiryDate);

    const res = await fetch(`http://localhost:8080/api/inventory/add?${params.toString()}`, {
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
    const confirm = window.confirm('Are you sure you want to delete this item?');
    if (!confirm) return;

    const res = await fetch(`http://localhost:8080/api/inventory/delete/${itemId}`, { method: 'DELETE' });
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

    const res = await fetch(`http://localhost:8080/api/inventory/finish/${itemToFinish.itemId}?addToShopping=${addToShopping}`, {
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

    const res = await fetch(`http://localhost:8080/api/inventory/update/${itemId}`, {
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

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>📦 Inventory Items</h3>

      <form onSubmit={handleAddItem} style={{ marginBottom: '30px' }}>
        <input name="itemName" placeholder="Item Name" required />
        <input name="quantity" type="number" placeholder="Quantity" required style={{ width: '70px' }} />
        <input name="unit" placeholder="Unit" required />
        <input
          name="expiryDate"
          type="text"
          placeholder="Expiry Date"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
          style={{ marginRight: '8px' }}
        />
        <button type="submit">Add</button>
      </form>

      {inventoryItems.length > 0 ? (
        <ul>
          {inventoryItems.map(item => (
            <li key={item.itemId} style={{ marginBottom: '10px' }}>
              {item.itemName} — {item.quantity} {item.unit}
              {item.expiryDate ? ` (expires on ${item.expiryDate})` : ''}
              <button onClick={() => setEditItem(item)} style={{ marginLeft: '10px' }}>Update</button>
              <button onClick={() => handleDelete(item.itemId)} style={{ marginLeft: '10px' }}>Delete</button>
              <button onClick={() => handleMarkFinished(item)} style={{ marginLeft: '10px' }}>Mark Finished</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in inventory.</p>
      )}

      {/* Modal for editing item */}
      <Modal
        isOpen={!!editItem}
        onRequestClose={() => setEditItem(null)}
        contentLabel="Edit Item"
        style={{ content: { width: '400px', margin: 'auto' } }}
      >
        {editItem && (
          <form onSubmit={handleUpdateSubmit}>
            <h2>Edit Item</h2>
            <input name="itemName" defaultValue={editItem.itemName} required />
            <input name="quantity" type="number" defaultValue={editItem.quantity} required />
            <input name="unit" defaultValue={editItem.unit} required />
            <input name="expiryDate" type="date" defaultValue={editItem.expiryDate || ''} />
            <button type="submit" style={{ marginRight: '10px' }}>Save</button>
            <button type="button" onClick={() => setEditItem(null)}>Cancel</button>
          </form>
        )}
      </Modal>

      {/* Modal for confirming mark finished */}
      <Modal
        isOpen={confirmFinishModalOpen}
        onRequestClose={() => setConfirmFinishModalOpen(false)}
        contentLabel="Confirm Finish"
        style={{ content: { width: '400px', margin: 'auto', textAlign: 'center' } }}
      >
        <h2>Are you sure you want to mark this item as finished?</h2>
        <button onClick={confirmMarkFinished} style={{ marginRight: '10px' }}>Yes</button>
        <button onClick={() => setConfirmFinishModalOpen(false)}>No</button>
      </Modal>
    </div>
  );
}

export default InventorySection;
