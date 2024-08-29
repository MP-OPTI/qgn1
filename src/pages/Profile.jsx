import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import BucketUploader from '../components/user/BucketUploader';
import ProfileField from '../components/user/ProfileField';
import DeleteAccountButton from '../components/user/DeleteAccountButton';
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [buckets, setBuckets] = useState([]);
  const [savedBuckets, setSavedBuckets] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setDisplayName(profileData.displayName);
          setBio(profileData.bio || '');
          setBuckets(profileData.buckets ? profileData.buckets.map(bucket => ({
            ...bucket,
            files: bucket.files || [],
          })) : []);
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (user && buckets.length) {
      const docRef = doc(db, 'profiles', user.uid);
      updateDoc(docRef, { buckets });
    }
  }, [buckets, user]);

  const addBucket = () => {
    const newBucket = {
      id: uuidv4(),
      name: `Bucket ${buckets.length + 1}`,
      files: [],
    };
    setBuckets([...buckets, newBucket]);
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

  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        <ProfileField
          label="Name"
          value={displayName}
          setValue={setDisplayName}
          fieldName="displayName"
          user={user}
        />
        <ProfileField
          label="Description"
          value={bio}
          setValue={setBio}
          fieldName="bio"
          user={user}
        />

        {buckets.map((bucket) => (
          <div key={bucket.id} className="mb-4">
            <input
              type="text"
              value={bucket.name}
              onChange={(e) => updateBucketName(bucket.id, e.target.value)}
              onBlur={() => updateBucketName(bucket.id, bucket.name)}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                savedBuckets[bucket.id] ? 'border-green-500 focus:ring-green-500' : 'focus:ring-blue-500'
              }`}
            />
            <BucketUploader
              user={user}
              files={bucket.files || []}
              setFiles={(newFiles) => updateBucketFiles(bucket.id, newFiles)}
            />
            <button
              onClick={() => deleteBucket(bucket.id)}
              className="mt-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Delete Bucket
            </button>
          </div>
        ))}

        <button 
          onClick={addBucket}
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Add Another Bucket
        </button>
      </div>
      <div className="max-w-md mx-auto p-2 rounded-lg shadow-md flex justify-center">
        <div className="mb-4">
          <DeleteAccountButton profilePicUrl={buckets[0]?.files[0]?.url} user={user} />
        </div>
      </div>
    </>
  );
};

export default Profile;
