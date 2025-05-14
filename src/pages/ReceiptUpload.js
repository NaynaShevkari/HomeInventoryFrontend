import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function ReceiptUpload({ onExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(file, 'eng');
      const lines = result.data.text.split('\n');
      const parsedItems = parseReceiptLines(lines);

      if (parsedItems.length > 0) {
        onExtracted(parsedItems); // pass to parent
      } else {
        alert("No items could be parsed from the receipt.");
      }
    } catch (err) {
      console.error("OCR error:", err);
      alert("Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseReceiptLines = (lines) => {
    const parsedItemsMap = new Map();
  
    const blacklist = [
      "total", "subtotal", "vat", "helpline", "tel", "amt", "base", "disc",
      "rate", "net", "rewards", "balance", "cash", "payment", "change",
      "transaction", "date", "time", "tax", "receipt", "rs.", "sale", "thank"
    ];
  
    for (let line of lines) {
      const clean = line.trim().toLowerCase();
      if (!clean || clean.length < 4) continue;
      if (blacklist.some(word => clean.includes(word))) continue;
      if (/\d{2}:\d{2}/.test(clean) || /\d{2}\/\d{2}/.test(clean)) continue;
      if (/^\||^\/|^\d{4}/.test(clean)) continue;
  
      // Case 1: US-style price at end — "ItemName $3.99"
      let match = line.match(/^(.+?)\s+\$([\d.]+)$/);
      if (match) {
        let itemName = match[1].trim().replace(/[^a-zA-Z0-9\s/()\-]/g, '');
        const key = itemName.toLowerCase();
        if (parsedItemsMap.has(key)) {
          parsedItemsMap.get(key).quantity += 1;
        } else {
          parsedItemsMap.set(key, { itemName, quantity: 1, unit: 'pcs' });
        }
        continue;
      }
  
      // Case 2: Big Bazaar format — "ITEM  QTY  AMT"
      match = line.match(/^(.+?)\s+(\d+)\s+[\d.]+$/);
      if (match) {
        let itemName = match[1].trim().replace(/[^a-zA-Z0-9\s/()\-]/g, '');
        const quantity = parseInt(match[2]);
        const key = itemName.toLowerCase();
        if (parsedItemsMap.has(key)) {
          parsedItemsMap.get(key).quantity += quantity;
        } else {
          parsedItemsMap.set(key, { itemName, quantity, unit: 'pcs' });
        }
        continue;
      }
  
      // Case 3: Quantity in colon format — "ITEM : 300"
      match = line.match(/^(.+?)\s*:\s*(\d+(\.\d+)?)/);
      if (match) {
        let itemName = match[1].trim().replace(/[^a-zA-Z0-9\s/()\-]/g, '');
        const quantity = parseFloat(match[2]);
        const key = itemName.toLowerCase();
        if (parsedItemsMap.has(key)) {
          parsedItemsMap.get(key).quantity += quantity;
        } else {
          parsedItemsMap.set(key, { itemName, quantity, unit: 'pcs' });
        }
        continue;
      }
  
      // Case 4: Weight-based — "ItemName  2.050/LB"
      match = line.match(/^(.+?)\s+([\d.]+)\/lb/i);
      if (match) {
        let itemName = match[1].trim().replace(/[^a-zA-Z0-9\s/()\-]/g, '');
        const quantity = parseFloat(match[2]);
        const key = itemName.toLowerCase();
        if (parsedItemsMap.has(key)) {
          parsedItemsMap.get(key).quantity += quantity;
        } else {
          parsedItemsMap.set(key, { itemName, quantity, unit: 'lb' });
        }
        continue;
      }
    }
  
    return Array.from(parsedItemsMap.values());
  };
  

// const parseReceiptLines = (lines) => {
//     const parsedItemsMap = new Map();
  
//     const blacklistKeywords = [
//       "total", "subtotal", "vat", "helpline", "tel", "amt", "base",
//       "disc", "rate", "net", "rewards", "balance", "cash", "payment",
//       "change", "f", "transaction", "date", "time", "tax", "receipt", "rs.",
//       "sale", "store", "thank", "invoice"
//     ];
  
//     for (let line of lines) {
//       const clean = line.trim().toLowerCase();
//       if (!clean || clean.length < 5) continue;
//       if (blacklistKeywords.some(word => clean.includes(word))) continue;
//       if (/\d{2}:\d{2}/.test(clean) || /\d{2}\/\d{2}/.test(clean)) continue;
//       if (/^\||^\/|^\d{4}/.test(clean)) continue;
  
//       const match = line.match(/^(.+?)\s+\$([\d.]+)$/);
//       if (match) {
//         let itemName = match[1].trim();
//         if (!/[a-zA-Z]/.test(itemName)) continue;
//         itemName = itemName.replace(/[^a-zA-Z0-9\s/()\-]/g, '');
  
//         // Count occurrences for quantity
//         const key = itemName.toLowerCase();
//         if (parsedItemsMap.has(key)) {
//           parsedItemsMap.get(key).quantity += 1;
//         } else {
//           parsedItemsMap.set(key, { itemName, quantity: 1, unit: 'pcs' });
//         }
//       }
//     }
  
//     return Array.from(parsedItemsMap.values());
//   };
  

  return (
    <div>
      <label style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        {isProcessing ? 'Processing...' : 'Upload Receipt'}
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

export default ReceiptUpload;
