import React, { useState, useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import { QRCodeSVG } from 'qrcode.react';
import { storage } from '../firebaseConfig'; // Ensure this path is correct
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode'; // Import the qrcode library

const monday = mondaySdk();

const MondayBoard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchBoardItems = async () => {
      try {
        monday.setToken(import.meta.env.VITE_MONDAY_API_TOKEN);
        const res = await monday.api(`query {
          boards(ids: ${import.meta.env.VITE_MONDAY_BOARD_ID}) {
            items_page {
              items {
                id
                name
                column_values(ids: ["name", "item_id__1"]) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-8 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Monday.com Board Items</h2>
      <ul>
        {items.map(item => (
          <li key={item.id} className="mb-4 p-4 border rounded-lg">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <ul>
              {item.column_values.map(column => (
                <li key={column.id}>{column.text}</li>
              ))}
            </ul>
            <div>
              <QRCodeSVG id={`qr-code-${item.id}`} value={item.id} size={128} />
              <button
                onClick={() => handleQRCodeGeneration(item)}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload QR Code'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MondayBoard;
