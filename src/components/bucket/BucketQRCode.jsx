import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandWave } from '@fortawesome/pro-solid-svg-icons';

const BucketQRCode = ({ user, bucketId }) => {
  const qrRef = useRef();
  const bucketUrl = user?.uid 
    ? `${window.location.origin}/bucket/${user.uid}/${bucketId}`
    : '';

  const downloadSVG = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'qrcode.svg');
  };

  const downloadPNG = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, 'qrcode.png');
      });
    };
  };

  const copyImage = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
      });
    };
  };

  if (!user?.uid) {
    return <div>Unable to generate QR code: User ID not available</div>;
  }

  return (
    <div className="mt-4 flex flex-col items-center h-full max-h-full overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full w-full max-w-xs" ref={qrRef} style={{ maxHeight: 'calc(100% - 100px)' }}>
        <QRCodeSVG 
          value={bucketUrl} 
          size={265} 
          className="w-full h-auto object-contain"
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
        />
      </div>
      <div className="mt-8 px-2 flex flex-row space-x-2 w-full justify-center">
        <button
          onClick={downloadPNG}
          className="py-3 px-4 bg-purple-500 text-white text-4xl rounded-lg hover:bg-purple-400 flex items-center justify-center"
        >
          <FontAwesomeIcon icon="file-png" />
        </button>
        <button
          onClick={downloadSVG}
          className="py-3 px-4 bg-violet-500 text-white text-4xl rounded-lg hover:bg-violet-400 flex items-center justify-center"
        >
          <FontAwesomeIcon icon="file-svg"/>
        </button>
        <button
          onClick={copyImage}
          className="py-3 px-4 bg-indigo-500 text-white text-4xl rounded-lg hover:bg-indigo-400 flex items-center justify-center"
        >
          <FontAwesomeIcon icon="copy" />
        </button>
      </div>
    </div>
  );
};

export default BucketQRCode;
