import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const BucketView = () => {
  const { userId, bucketId } = useParams();
  const [bucket, setBucket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('BucketView mounted, userId:', userId, 'bucketId:', bucketId);
    const fetchBucket = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'profiles', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const buckets = userData.buckets || [];
          const foundBucket = buckets.find(b => b.id === bucketId);
          
          if (foundBucket) {
            console.log('Bucket data:', foundBucket);
            setBucket(foundBucket);
          } else {
            console.log("No such bucket!");
            setError("Bucket not found");
          }
        } else {
          console.log("No such user!");
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching bucket:", err);
        setError("Error fetching bucket");
      }
    };

    fetchBucket();
  }, [userId, bucketId]);

  if (error) {
    return <div>Error: {error} (BucketId: {bucketId})</div>;
  }

  if (!bucket) {
    return <div>Loading... (BucketId: {bucketId})</div>;
  }

  const downloadFile = (file) => {
    window.open(file.url, '_blank');
  };

  const downloadAllFiles = async () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
    if (isChrome) {
      try {
        const zip = new JSZip();
        
        for (const file of bucket.files) {
          const blob = await fetch(file.url, { mode: 'no-cors' }).then(r => r.blob());
          zip.file(file.name, blob, { binary: true });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${bucket.name}.zip`);
      } catch (error) {
        console.error('Error creating zip file:', error);
      }
    } else {
      bucket.files.forEach(file => downloadFile(file));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-8 pt-16 bg-white rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold mb-4">{bucket.name}</h3>
      <div className="grid grid-cols-1 gap-4">
        {bucket.files && bucket.files.map((file) => (
          <div key={file.id} className="flex items-center justify-between space-x-4 pt-4 pb-4 mb-1 ml-2 mr-2 bg-slate-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span>{file.name.split('.').pop().toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div>
                <p>{file.name}</p>
                <p className="text-sm text-gray-500">{file.type}</p>
              </div>
            </div>
            <button
              onClick={() => downloadFile(file)}
              className="p-4 text-indigo-500 hover:text-blue-600"
              title="Download file"
            >
              <FontAwesomeIcon icon="download" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={downloadAllFiles}
          className="py-2 px-6 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
          title="Download all files"
        >
          <FontAwesomeIcon icon="download" />
        </button>
      </div>
    </div>
  );
};

export default BucketView;
