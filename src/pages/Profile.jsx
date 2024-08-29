import React, { useState, useEffect } from 'react';
import { auth, db} from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import ProfileField from '../components/user/ProfileField';
import DeleteAccountButton from '../components/user/DeleteAccountButton';


const Profile = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [buckets] = useState([]);
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
        }
      }
    };

    fetchProfile();
  }, [user]);



  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        {user && (
          <div className="mb-4 p-2 bg-gray-100 rounded-lg">
             <p className="text-sm text-gray-600">User ID: {user.uid}</p> 
          </div>
        )}
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
