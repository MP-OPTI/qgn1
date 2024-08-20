// File: src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import ProfileForm from '../components/user/form/ProfileForm';
import { useNavigate } from 'react-router-dom';
import ResetPasswordButton from '../components/user/ResetPasswordButton';

const Profile = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setDisplayName(profileData.displayName);
          setBio(profileData.bio || '');
          setProfilePicUrl(profileData.profilePic || '');
        }
      }
    };

    fetchProfile();
  }, [user]);


  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "profiles", user.uid);
      await updateDoc(docRef, {
        displayName: displayName,
        bio: bio,
        profilePic: profilePicUrl, 
      });
      setIsEditing(false);
    }
  };
  

  const handleUploadComplete = async (newUrl) => {
    setProfilePicUrl(newUrl); // Update the profilePicUrl state in the parent component
    await handleSave(); // Automatically save the updated profile
  };

  const handleDeleteAccount = async () => {
    if (user) {
      const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (confirmation) {
        try {
          await deleteDoc(doc(db, "profiles", user.uid));
          await deleteUser(user);
          navigate('/');
        } catch (error) {
          console.error("Error deleting account:", error);
          alert("Error deleting account. Please try again.");
        }
      }
    }
  };


  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {isEditing ? (
        <ProfileForm
          displayName={displayName}
          bio={bio}
          profilePicUrl={profilePicUrl}
          setDisplayName={setDisplayName}
          setBio={setBio}
          setProfilePicUrl={setProfilePicUrl}
          onSave={handleSave}
          storagePath={`profile_pictures/${user.uid}`} // Pass uid here
          onUploadComplete={handleUploadComplete}
        />
      ) : (
        <>
          {profilePicUrl && <img src={profilePicUrl} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />}
          <div className="mb-4">
            <h3 className="text-xl font-bold">Display Name</h3>
            <p className="text-gray-700">{displayName}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Bio</h3>
            <p className="text-gray-700">{bio}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </>
      )}
      <ResetPasswordButton email={user?.email} />
      <button
        onClick={handleDeleteAccount}
        className="w-full mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
