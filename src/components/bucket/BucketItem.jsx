import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BucketUploader from './BucketUploader';
import BucketQRCode from './BucketQRCode';

const copyBucketLink = (user, bucket) => {
  const bucketUrl = `${window.location.origin}/bucket/${user.uid}/${bucket.id}`;
  navigator.clipboard.writeText(bucketUrl).then(() => {
    alert('Bucket link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy the text to clipboard', err);
  });
};

const openBucketLinkInNewTab = (user, bucket) => {
  const bucketUrl = `${window.location.origin}/bucket/${user.uid}/${bucket.id}`;
  window.open(bucketUrl, '_blank');
};

const BucketItem = ({ bucket, updateBucketName, deleteBucket, toggleQRCodeLightbox, qrCodeLightbox, user, setBuckets, savedBuckets, buckets }) => {
  return (
    <div className="my-8 p-4 rounded-lg shadow-xl relative">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={bucket.name}
          onChange={(e) => updateBucketName(bucket.id, e.target.value)}
          onBlur={() => updateBucketName(bucket.id, bucket.name)}
          className={`w-full text-xl p-2 rounded-lg font-bold focus:outline-none focus:ring-2 ${
            savedBuckets[bucket.id] ? 'border-green-500 focus:ring-green-500' : 'focus:ring-blue-500'
          }`}
        />
        <button
          onClick={() => deleteBucket(bucket.id)}
          className="ml-4 text-slate-600 p-2 rounded-lg hover:bg-red-600 hover:text-white w-8 h-8 flex items-center justify-center transition-all duration-200" >
          <FontAwesomeIcon icon="trash" />
        </button>
      </div>
      <h3 className="font-bold mb-2 ml-2">Share your bucket</h3>
      <div className="flex items-center space-x-4">
        <div 
          className="flex items-center cursor-pointer hover:text-indigo-500 transition-all duration-200"
          onClick={() => toggleQRCodeLightbox(bucket.id)}
        >
          <FontAwesomeIcon icon="qrcode" className="mr-1 ml-2 text-2xl" />
        </div>
        <div className="flex items-center cursor-pointer hover:text-indigo-500 transition-all duration-200" onClick={() => copyBucketLink(user, bucket)}>
          <FontAwesomeIcon icon="link" className="mr-2 text-2xl" />
        </div>
        <div className="flex items-center cursor-pointer hover:text-indigo-500 transition-all duration-200" onClick={() => openBucketLinkInNewTab(user, bucket)}>
          <FontAwesomeIcon icon="external-link-alt" className="mr-2 text-2xl" />
        </div>
      </div>
      {qrCodeLightbox[bucket.id] && (
        <div 
          className="absolute inset-0 backdrop-blur-sm bg-white/60 rounded-lg flex items-center justify-center hover:cursor-pointer"
          onClick={() => toggleQRCodeLightbox(bucket.id)}
        >
          <button
            className="absolute top-2 right-3 text-gray-800 text-2xl hover:text-gray-600 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              toggleQRCodeLightbox(bucket.id);
            }}
          >
            <FontAwesomeIcon icon="times" />
          </button>
          <div className="bg-white/0 p-4 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
            <BucketQRCode user={user} bucketId={bucket.id} className="w-48 h-48"/>
          </div>
        </div>
      )}
      <BucketUploader
        key={bucket.id}
        user={user}
        files={bucket.files || []}
        setFiles={(newFiles) => {
          setBuckets(prevBuckets => 
            prevBuckets.map(b => 
              b.id === bucket.id ? {...b, files: newFiles} : b
            )
          );
        }}
        bucketId={bucket.id}
        buckets={buckets}
      />
    </div>
  );
};

export default BucketItem;
