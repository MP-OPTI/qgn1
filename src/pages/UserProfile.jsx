// File: src/pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const UserProfile = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'profiles', userId));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{user.displayName || user.email}</h2>
      <p>{user.bio}</p>
      {/* Add more user details here */}
    </div>
  );
};

export default UserProfile;
