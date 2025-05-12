// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';

// Modal.setAppElement('#root');

// function ShoppingListSection({ groupName }) {
//   const [shoppingItems, setShoppingItems] = useState([]);
//   const [editItem, setEditItem] = useState(null);

//   const fetchShoppingItems = async () => {
//     try {
//       const res = await fetch(`http://localhost:8080/api/shopping/${groupName}`);
//       const data = await res.json();
//       setShoppingItems(data);
//     } catch (err) {
//       console.error('Error fetching shopping items:', err);
//     }
//   };

//   useEffect(() => {
//     if (groupName) {
//       fetchShoppingItems();
//     }
//   }, [groupName]);

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const itemName = formData.get('itemName');
//     const quantity = formData.get('quantity');
//     const unit = formData.get('unit');
//     const username = localStorage.getItem('loggedInUsername');

//     const params = new URLSearchParams({
//       groupName,
//       username,
//       itemName,
//       quantity,
//       unit,
//     });

//     const res = await fetch(`http://localhost:8080/api/shopping/add?${params.toString()}`, {
//       method: 'POST',
//     });

//     if (res.ok) {
//       alert('Item added to shopping list');
//       e.target.reset();
//       fetchShoppingItems();
//     } else {
//       const err = await res.text();
//       alert('Error: ' + err);
//     }
//   };

//   const handleDelete = async (itemId) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;

//     const res = await fetch(`http://localhost:8080/api/shopping/delete/${itemId}`, {
//       method: 'DELETE'
//     });

//     if (res.ok) {
//       alert('Item deleted');
//       fetchShoppingItems();
//     } else {
//       alert('Failed to delete item');
//     }
//   };

//   const handleMarkAsBought = async (itemId) => {
//     if (!window.confirm('Mark this item as bought and add to inventory?')) return;

//     const res = await fetch(`http://localhost:8080/api/shopping/bought/${itemId}`, {
//       method: 'POST'
//     });

//     if (res.ok) {
//       alert('Item moved to inventory');
//       fetchShoppingItems();
//     } else {
//       alert('Failed to mark as bought');
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const res = await fetch(`http://localhost:8080/api/shopping/update/${editItem.shoppingItemId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         itemName: formData.get('itemName'),
//         quantity: formData.get('quantity'),
//         unit: formData.get('unit')
//       })
//     });

//     if (res.ok) {
//       alert('Item updated!');
//       setEditItem(null);
//       fetchShoppingItems();
//     } else {
//       const err = await res.text();
//       alert('Update failed: ' + err);
//     }
//   };

//   return (
//     <div>
//       <h3>🛒 Shopping List</h3>

//       <form onSubmit={handleAddItem} style={{ marginBottom: '20px' }}>
//         <input name="itemName" placeholder="Item name" required />
//         <input name="quantity" type="number" placeholder="Qty" required style={{ width: '70px' }} />
//         <input name="unit" placeholder="Unit (e.g. kg, pcs)" required />
//         <button type="submit">Add</button>
//       </form>

//       {shoppingItems.length > 0 ? (
//         <ul>
//           {shoppingItems.map(item => (
//             <li key={item.shoppingItemId} style={{ marginBottom: '10px' }}>
//               {item.itemName} — {item.quantity}{item.unit}
//               <button onClick={() => setEditItem(item)} style={{ marginLeft: '10px' }}>Update</button>
//               <button onClick={() => handleDelete(item.shoppingItemId)} style={{ marginLeft: '10px' }}>Delete</button>
//               <button onClick={() => handleMarkAsBought(item.shoppingItemId)} style={{ marginLeft: '10px' }}>Mark as Bought</button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No items in shopping list.</p>
//       )}

//       <Modal
//         isOpen={!!editItem}
//         onRequestClose={() => setEditItem(null)}
//         contentLabel="Edit Shopping Item"
//         style={{ content: { width: '400px', margin: 'auto' } }}
//       >
//         {editItem && (
//           <form onSubmit={handleUpdateSubmit}>
//             <h2>Edit Item</h2>
//             <input name="itemName" defaultValue={editItem.itemName} required />
//             <input name="quantity" type="number" defaultValue={editItem.quantity} required />
//             <input name="unit" defaultValue={editItem.unit} required />
//             <button type="submit" style={{ marginRight: '10px' }}>Save</button>
//             <button type="button" onClick={() => setEditItem(null)}>Cancel</button>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default ShoppingListSection;

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ShoppingListSection({ groupName }) {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const fetchShoppingItems = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/shopping/${groupName}`);
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

    const res = await fetch(`http://localhost:8080/api/shopping/add?${params.toString()}`, {
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

    const res = await fetch(`http://localhost:8080/api/shopping/delete/${itemId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Item deleted');
      fetchShoppingItems();
    } else {
      alert('Failed to delete item');
    }
  };

  const handleMarkAsBought = async (itemId) => {
    if (!window.confirm('Mark this item as bought and add to inventory?')) return;

    const res = await fetch(`http://localhost:8080/api/shopping/bought/${itemId}`, {
      method: 'POST',
    });

    if (res.ok) {
      alert('Item moved to inventory');
      fetchShoppingItems();
    } else {
      alert('Failed to mark as bought');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch(
      `http://localhost:8080/api/shopping/update/${editItem.shoppingItemId}`,
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
    <div>
      <h3>🛒 Shopping List</h3>

      <form onSubmit={handleAddItem} style={{ marginBottom: '20px' }}>
        <input name="itemName" placeholder="Item name" required />
        <input name="quantity" type="number" placeholder="Qty" required style={{ width: '70px' }} />
        <input name="unit" placeholder="Unit (e.g. kg, pcs)" required />
        <button type="submit">Add</button>
      </form>

      {shoppingItems.length > 0 ? (
        <ul>
          {shoppingItems.map((item) => (
            <li key={item.shoppingItemId} style={{ marginBottom: '10px' }}>
              {item.itemName} — {item.quantity} {item.unit}
              <button onClick={() => setEditItem(item)} style={{ marginLeft: '10px' }}>
                Update
              </button>
              <button onClick={() => handleDelete(item.shoppingItemId)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
              <button onClick={() => handleMarkAsBought(item.shoppingItemId)} style={{ marginLeft: '10px' }}>
                Mark as Bought
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in shopping list.</p>
      )}

      <Modal
        isOpen={!!editItem}
        onRequestClose={() => setEditItem(null)}
        contentLabel="Edit Shopping Item"
        style={{ content: { width: '400px', margin: 'auto' } }}
      >
        {editItem && (
          <form onSubmit={handleUpdateSubmit}>
            <h2>Edit Item</h2>
            <input name="itemName" defaultValue={editItem.itemName} required />
            <input name="quantity" type="number" defaultValue={editItem.quantity} required />
            <input name="unit" defaultValue={editItem.unit || ''} placeholder="Unit" required />
            <button type="submit" style={{ marginRight: '10px' }}>
              Save
            </button>
            <button type="button" onClick={() => setEditItem(null)}>
              Cancel
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ShoppingListSection;

