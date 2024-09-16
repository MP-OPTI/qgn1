import React, { useState, useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import { QRCodeSVG } from 'qrcode.react';
import { storage } from '../firebaseConfig'; // Ensure this path is correct
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode'; // Import the qrcode library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const monday = mondaySdk();

const MondayBoard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newItemName, setNewItemName] = useState(''); // State for new item name
  const [newItemPlacement, setNewItemPlacement] = useState(''); // State for new item placement
  const [newItemAmount, setNewItemAmount] = useState(''); // State for new item amount

  const fetchBoardItems = async () => {
    try {
      monday.setToken(import.meta.env.VITE_MONDAY_API_TOKEN);
      const res = await monday.api(`query {
        boards(ids: ${import.meta.env.VITE_MONDAY_BOARD_ID}) {
          items_page {
            items {
              id
              name
              column_values(ids: ["name", "item_id__1", "text8__1", "numbers__1", "link__1"]) {
                id
                text
              }
            }
            cursor
          }
        }
      }`);
      console.log('API Response:', res);
      if (res.errors) {
        console.error('API Errors:', res.errors);
      } else if (res.data && res.data.boards) {
        setItems(res.data.boards[0].items_page.items);
      } else {
        console.error('Unexpected API response structure:', res);
      }
    } catch (error) {
      console.error('Error fetching board items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardItems();
  }, []);

  const uploadQRCode = async (itemId, qrCodeDataUrl) => {
    const storageRef = ref(storage, `qrcodes/${itemId}.png`);
    await uploadString(storageRef, qrCodeDataUrl, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const updateItemWithQRCode = async (itemId, qrCodeUrl) => {
    try {
      const mutation = `mutation ($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(
          board_id: $boardId,
          item_id: $itemId,
          column_id: $columnId,
          value: $value
        ) {
          id
        }
      }`;

      const variables = {
        boardId: import.meta.env.VITE_MONDAY_BOARD_ID,
        itemId: itemId.toString(),
        columnId: "link__1", // Replace with your actual column ID
        value: JSON.stringify({
          url: qrCodeUrl,
          text: 'View QR Code'
        })
      };

      console.log('Mutation:', mutation);
      console.log('Variables:', JSON.stringify(variables, null, 2));

      const res = await monday.api(mutation, { variables });
      console.log('Mutation Response:', res);

      if (res.errors) {
        console.error('Mutation Errors:', JSON.stringify(res.errors, null, 2));
      }
    } catch (error) {
      console.error('Error updating item with QR code:', error);
    }
  };

  const handleQRCodeGeneration = async (item) => {
    setIsUploading(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(item.id); // Generate QR code data URL
      const qrCodeUrl = await uploadQRCode(item.id, qrCodeDataUrl);
      await updateItemWithQRCode(item.id, qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateItem = async () => {
    try {
      const mutation = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
          id
          name
        }
      }`;

      const variables = {
        boardId: import.meta.env.VITE_MONDAY_BOARD_ID,
        itemName: newItemName,
        columnValues: JSON.stringify({
          text8__1: newItemPlacement,
          numbers__1: newItemAmount
        })
      };

      const res = await monday.api(mutation, { variables });
      console.log('Create Item Response:', res);

      if (res.errors) {
        console.error('Create Item Errors:', JSON.stringify(res.errors, null, 2));
      } else {
        const newItem = res.data.create_item;
        setItems([...items, newItem]);
        setNewItemName(''); // Clear the input field
        setNewItemPlacement(''); // Clear the input field
        setNewItemAmount(''); // Clear the input field

        // Automatically generate and upload QR code for the new item
        await handleQRCodeGeneration(newItem);

        // Reload the data to get updated values
        await fetchBoardItems();
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const mutation = `mutation ($itemId: ID!) {
        delete_item(item_id: $itemId) {
          id
        }
      }`;

      const variables = {
        itemId: itemId.toString()
      };

      const res = await monday.api(mutation, { variables });
      console.log('Delete Item Response:', res);

      if (res.errors) {
        console.error('Delete Item Errors:', JSON.stringify(res.errors, null, 2));
      } else {
        setItems(items.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handlePrintQRCode = (itemId) => {
    const qrCodeElement = document.getElementById(`qr-code-${itemId}`);
    if (qrCodeElement) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
      printWindow.document.write(qrCodeElement.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 px-8 py-16 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Monday.com Board Items</h2>
      <div className="mb-4">
        <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item name"
            className="border mt-2 p-2 rounded mr-2 w-1/2"
        />
        <input
            type="text"
            value={newItemPlacement}
            onChange={(e) => setNewItemPlacement(e.target.value)}
            placeholder="Placement"
            className="border mt-2 p-2 rounded mr-2 w-1/2"
        />
        <input
            type="number"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Amount"
            className="border mt-2 p-2 rounded mr-2 w-1/2"
        />
        <button onClick={handleCreateItem} className="bg-blue-500 text-white p-2 rounded">
          Create Item
        </button>
      </div>
      <ul>
        {items.map(item => {
          const columnValues = item.column_values || [];
          const qrCodeColumn = columnValues.find(col => col.id === 'link__1');
          const hasQRCode = qrCodeColumn && qrCodeColumn.text;

          return (
            <li key={item.id} className="mb-4 p-4 border rounded-lg relative">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className='py-2'>Placement: {columnValues.find(col => col.id === 'text8__1')?.text || 'N/A'}</p>
              <p className='py-2'>Amount: {columnValues.find(col => col.id === 'numbers__1')?.text || 'N/A'}</p>
              <div className="py-4">
                <QRCodeSVG id={`qr-code-${item.id}`} value={item.id} size={128} />
                {!hasQRCode && (
                  <button
                    onClick={() => handleQRCodeGeneration(item)}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload QR Code'}
                  </button>
                )}
                <button
                  onClick={() => handlePrintQRCode(item.id)}
                  className="mt-4 bg-green-500 text-white p-2 rounded"
                >
                  Print QR Code
                </button>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <FontAwesomeIcon icon="trash" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MondayBoard;
