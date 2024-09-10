import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import ProfileField from '../components/user/ProfileField';
import DeleteAccountButton from '../components/user/DeleteAccountButton';
import ResetPasswordButton from '../components/user/ResetPasswordButton';
import { sendEmailVerification } from 'firebase/auth'; // Import sendEmailVerification

const Profile = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [buckets] = useState([]);
  const [emailVerified, setEmailVerified] = useState(false); // State for email verification status
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
        setEmailVerified(user.emailVerified); // Set email verification status
      }
    };

    fetchProfile();
  }, [user]);

  const handleSendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        alert('Verification email sent.');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-6 p-8 pt-16 bg-white rounded-lg shadow-sm">
        {user && (
          <>
            <div className="mb-4 p-2 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">User ID: {user.uid}</p>
            </div>
            <div className="mb-4 p-2 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">
                Status: {emailVerified ? <span className="text-green-500">Verified</span> : <span className="text-red-500">Not Verified</span>}
              </p>
              {!emailVerified && (
                <button
                  onClick={handleSendVerificationEmail}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Send Verification Email
                </button>
              )}
            </div>
          </>
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
        {user && (
          <>
            <ResetPasswordButton email={user.email} buttonText="Reset Password" className="mt-4" />
          </>
        )}
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
