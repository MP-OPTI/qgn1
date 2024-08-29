import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebaseConfig';

const DeleteAccountButton = ({ profilePicUrl, user }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmDelete) {
      if (user) {
        const userRef = doc(db, 'profiles', user.uid);
        if (profilePicUrl) {
          const imageRef = ref(storage, profilePicUrl);
          await deleteObject(imageRef); // Delete profile picture from storage
        }
        await deleteDoc(userRef); // Delete user profile from Firestore
        await user.delete(); // Delete user account
        navigate('/'); // Redirect to home after deletion
      }
    }
  };

  return (
    <div className="mt-4">
      <a
        href="#"
        onClick={handleDeleteAccount}
        className="text-red-500 hover:underline"
      >
        Delete Account
      </a>
    </div>
  );
};

export default DeleteAccountButton;
