import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ProfileField = ({ label, value, setValue, fieldName, user }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, {
        [fieldName]: value,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isSaved ? 'border-green-500 focus:ring-green-500' : 'focus:ring-blue-500'
          }`}
        />
    </div>
  );
};

export default ProfileField;
