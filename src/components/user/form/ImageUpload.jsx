// File: src/components/user/form/ImageUpload.jsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';

const ImageUpload = ({ storagePath, onUploadComplete, existingImageUrl }) => {
  const [preview, setPreview] = useState(existingImageUrl || '');
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (file) {
      const imageRef = ref(storage, `${storagePath}/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);
      onUploadComplete(downloadUrl);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {preview && <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-full" />}
      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
