import React from 'react';
import BucketItem from './BucketItem';

const BucketList = ({ buckets, updateBucketName, deleteBucket, toggleQRCodeLightbox, qrCodeLightbox, user, setBuckets, savedBuckets }) => {
  return (
    <div className="max-w-md mx-auto mt-6 p-8 bg-white rounded-lg shadow-sm">
      {buckets.map((bucket) => (
        <BucketItem
          key={bucket.id}
          bucket={bucket}
          updateBucketName={updateBucketName}
          deleteBucket={deleteBucket}
          toggleQRCodeLightbox={toggleQRCodeLightbox}
          qrCodeLightbox={qrCodeLightbox}
          user={user}
          setBuckets={setBuckets}
          savedBuckets={savedBuckets}
          buckets={buckets}
        />
      ))}
    </div>
  );
};

export default BucketList;
