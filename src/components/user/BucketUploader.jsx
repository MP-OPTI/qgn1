import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const BucketUploader = ({ user, files = [], setFiles }) => { 

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const fileUrl = URL.createObjectURL(file);
        const fileRef = ref(storage, `buckets/${user.uid}/${file.name}`);
        const metadata = {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000',
        };
        await uploadBytes(fileRef, file, metadata);
        const downloadUrl = await getDownloadURL(fileRef);

        return { id: Date.now(), url: downloadUrl, name: file.name, type: file.type, preview: fileUrl };
      })
    );

    // Update local state and pass the array directly to the parent via setFiles
    const updatedFiles = [...files, ...uploadedFiles];
      setFiles(updatedFiles);  // Pass the resolved array here
    }, [user, files, setFiles]);

    const moveFile = (dragIndex, hoverIndex) => {
      const newFiles = [...files];
      const [draggedFile] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedFile);
      setFiles(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: '*', 
      multiple: true,
    });

  const FileItem = ({ file, index, moveFile }) => {
    const [, dragRef] = useDrag({
      type: 'file',
      item: { index },
    });

    const [, dropRef] = useDrop({
      accept: 'file',
      hover(item) {
        if (item.index !== index) {
          moveFile(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <div ref={(node) => dragRef(dropRef(node))} className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {file.type.startsWith('image/') ? (
              <img src={file.url} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded-lg" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span>{file.name.split('.').pop().toUpperCase()}</span>
              </div>
            )}
          </div>
          <div>
            <p>{file.name}</p>
            <p className="text-sm text-gray-500">{file.type}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-4">
        <label className="block text- font-medium text-gray-700">Upload Files to Bucket</label>
        <div
          {...getRootProps()}
          className={`w-full p-4 border-2 border-dashed rounded-lg cursor-pointer focus:outline-none ${
            isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center text-blue-500">Drop your files!</p>
          ) : (
            <p className="text-center text-gray-500">
              Drop zone - just drop any file here to upload it to your bucket.
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {files.map((file, index) => (
          <FileItem key={file.id} file={file} index={index} moveFile={moveFile} />
        ))}
      </div>
    </DndProvider>
  );
};

export default BucketUploader;
