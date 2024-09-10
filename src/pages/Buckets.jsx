import React, { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BucketList from '../components/bucket/BucketList';
import AddBucketButton from '../components/bucket/AddBucketButton';

const Profile = () => {
  const [buckets, setBuckets] = useState([]);
  const [savedBuckets, setSavedBuckets] = useState({});
  const user = auth.currentUser;
  const [qrCodeLightbox, setQrCodeLightbox] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      if (user) {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setBuckets(userData.buckets || []);
        }
      }
    };

    fetchBuckets();
  }, [user]);

  useEffect(() => {
    if (user && buckets.length) {
      const docRef = doc(db, 'profiles', user.uid);
  
      // Filter out non-serializable properties and handle cases where files is not an array
      const serializableBuckets = buckets.map(bucket => ({
        ...bucket,
        files: Array.isArray(bucket.files) ? bucket.files.map(file => ({
          ...file
          // Ensure no non-serializable fields are included in files, if needed
        })) : [] // Default to empty array if files is not an array
      }));
  
      updateDoc(docRef, { buckets: serializableBuckets });
    }
  }, [buckets, user]);

  const addBucket = async () => {
    const newBucket = {
      id: uuidv4(),
      name: `Bucket ${buckets.length + 1}`,
      files: [],
    };
    setBuckets([...buckets, newBucket]);
  
    // Update Firestore
    const docRef = doc(db, 'profiles', user.uid);
    await updateDoc(docRef, {
      buckets: arrayUnion(newBucket)
    });

    // Scroll to the new bucket after a short delay to ensure it's rendered
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const updateBucketFiles = (bucketId, newFiles) => {
    setBuckets((prevBuckets) =>
      prevBuckets.map((bucket) =>
        bucket.id === bucketId ? { ...bucket, files: newFiles } : bucket
      )
    );
  };

  const deleteBucket = async (bucketId) => {
    const bucket = buckets.find((b) => b.id === bucketId);
    if (bucket) {
      // Confirm the deletion action
      const confirmDelete = window.confirm(`Are you sure you want to delete the bucket "${bucket.name}" and all its files?`);
      if (!confirmDelete) return;
  
      // Delete each file in the bucket from Firebase Storage
      for (let file of bucket.files) {
        const fileRef = ref(storage, `buckets/${user.uid}/${file.name}`);
        await deleteObject(fileRef);
      }
  
      // Remove the bucket from local state and Firestore
      setBuckets((prevBuckets) => prevBuckets.filter((b) => b.id !== bucketId));
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, {
        buckets: arrayRemove(bucket) // Use arrayRemove to remove the bucket from Firestore
      });
    }
  };

  const updateBucketName = async (bucketId, newName) => {
    setBuckets((prevBuckets) =>
      prevBuckets.map((bucket) =>
        bucket.id === bucketId ? { ...bucket, name: newName } : bucket
      )
    );

    // Save changes to Firestore
    const docRef = doc(db, 'profiles', user.uid);
    await updateDoc(docRef, { buckets });
    // Indicate the bucket has been saved
    setSavedBuckets((prevSavedBuckets) => ({
      ...prevSavedBuckets,
      [bucketId]: true,
    }));

    // Reset the saved state after a delay
    setTimeout(() => {
      setSavedBuckets((prevSavedBuckets) => ({
        ...prevSavedBuckets,
        [bucketId]: false,
      }));
    }, 2000);
  };

  const toggleQRCodeLightbox = (bucketId) => {
    setQrCodeLightbox(prev => ({
      ...prev,
      [bucketId]: !prev[bucketId]
    }));
  };

  return (
    <>
      <AddBucketButton addBucket={addBucket} />
      <BucketList
        buckets={buckets}
        updateBucketName={updateBucketName}
        deleteBucket={deleteBucket}
        toggleQRCodeLightbox={toggleQRCodeLightbox}
        qrCodeLightbox={qrCodeLightbox}
        user={user}
        setBuckets={setBuckets}
        savedBuckets={savedBuckets}
      />
      <div ref={bottomRef} />
    </>
  );
};

export default Profile;
