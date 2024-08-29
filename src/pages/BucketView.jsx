import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{bucket.name}</h1>
      <div className="grid grid-cols-1 gap-4">
        {bucket.files && bucket.files.map((file) => (
          <div key={file.id} className="flex items-center space-x-4">
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
        ))}
      </div>
    </div>
  );
};

export default BucketView;
