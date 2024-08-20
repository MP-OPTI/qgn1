// File: src/components/user/form/ProfileForm.jsx
import React from 'react';
import ImageUpload from './ImageUpload';

const ProfileForm = ({ displayName, bio, profilePicUrl, setDisplayName, setBio, onSave, storagePath, onUploadComplete }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <ImageUpload
          storagePath={storagePath}  // Use the uid-based path here
          existingImageUrl={profilePicUrl}
          onUploadComplete={onUploadComplete}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <button
        onClick={onSave}
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Save
      </button>
    </>
  );
};

export default ProfileForm;
