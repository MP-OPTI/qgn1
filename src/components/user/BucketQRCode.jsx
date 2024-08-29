import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const BucketQRCode = ({ user, bucketId }) => {
  const bucketUrl = user?.uid 
    ? `${window.location.origin}/bucket/${user.uid}/${bucketId}`
    : '';

  if (!user?.uid) {
    return <div>Unable to generate QR code: User ID not available</div>;
  }

  return (
    <div className="mt-4">
      <div className="rounded-lg overflow-hidden inline-block">
        <QRCodeSVG 
          value={bucketUrl} 
          size={256} 
          className="w-full h-auto max-w-[256px] mx-auto"
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          // Remove deprecated 'includeMargin'
          imageSettings={{
            src: "/path/to/your/logo.png",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
    </div>
  );
};

export default BucketQRCode;
