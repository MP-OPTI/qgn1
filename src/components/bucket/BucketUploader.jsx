import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../firebaseConfig';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'react-toastify';
import { compressImage } from '../../utils/imageUtils';
import FileItem from './FileItem';
import UploadingFileItem from './UploadingFileItem';
import { moveFile, deleteFile } from '../../utils/fileUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const BucketUploader = ({ user, files = [], setFiles, bucketId, buckets }) => { 
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const validFiles = [];

    acceptedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} exceeds the maximum allowed size of 50 MB and was not uploaded.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      return;
    }

    const newUploadingFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0,
      preview: URL.createObjectURL(file),
    }));
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      const uploadedFiles = await Promise.all(
        validFiles.map(async (file, index) => {
          let fileToUpload = file;

          if (file.type.startsWith('image/')) {
            const compressedFile = await compressImage(file, (progress) => {
              setUploadProgress(prev => ({ ...prev, [file.name]: progress * 50 }));
            });

            if (!compressedFile) {
              throw new Error('File compression failed');
            }

            fileToUpload = compressedFile;
          }

          const fileRef = ref(storage, `buckets/${user.uid}/${fileToUpload.name}`);
          const uploadTask = uploadBytesResumable(fileRef, fileToUpload);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadingFiles(prev => prev.map((f, i) => i === index ? { ...f, progress } : f));
              },
              (error) => reject(error),
              () => resolve()
            );
          });

          const downloadUrl = await getDownloadURL(fileRef);

          return {
            id: newUploadingFiles[index].id,
            name: fileToUpload.name,
            type: fileToUpload.type,
            size: fileToUpload.size,
            url: downloadUrl,
            preview: URL.createObjectURL(fileToUpload),
          };
        })
      );

      const validUploadedFiles = uploadedFiles.filter(file => file !== null);

      if (validUploadedFiles.length > 0) {
        const updatedFiles = [...files, ...validUploadedFiles];
        setFiles(updatedFiles);

        const userDocRef = doc(db, 'profiles', user.uid);
        await updateDoc(userDocRef, {
          buckets: buckets.map(bucket => 
            bucket.id === bucketId 
              ? { ...bucket, files: updatedFiles }
              : bucket
          )
        });
      }

      setUploadingFiles(prev => prev.filter(f => !validUploadedFiles.some(vf => vf.id === f.id)));

    } catch (error) {
      console.error("Error processing files:", error);
      toast.error(`Error processing files. Please try again.`);
    }
  }, [user, files, setFiles, bucketId, buckets]);

  const handleMoveFile = (dragIndex, hoverIndex) => {
    moveFile(files, setFiles, dragIndex, hoverIndex);
  };

  const handleDeleteFile = (fileId, fileName) => {
    deleteFile(user, files, setFiles, buckets, bucketId, fileId, fileName);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.webp', '.svg', '.bmp', '.tiff', '.ico', '.heic', '.heif', '.avif'], // Added .heic and .heif
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.csv'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.mp3', '.wav', '.ogg', '.aac', '.m4a', '.mpa', '.mpe', '.mpeg', '.mpg', '.mpv', '.mxf', '.ogm', '.ogv', '.ogx', '.webm', '.wmv', '.xvid'], // Added .mov
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.mpa', '.mpe', '.mpeg', '.mpg', '.mpv', '.mxf', '.ogm', '.ogv', '.ogx', '.webm', '.wmv', '.xvid'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-office': ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'],
      'application/json': ['.json'], // Added JSON support
      'application/zip': ['.zip'],
      'application/rar': ['.rar'],
      'application/7z': ['.7z'],
      'application/x-7z-compressed': ['.7z'],
      'application/x-tar': ['.tar'],
      'application/x-gzip': ['.gz'],
      'application/x-bzip2': ['.bz2'],
      'application/x-omron-sysmac-studio': ['.smc2'], // Added Omron Sysmac Studio support
    },
    multiple: true,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-4 p-2">
        <label className="block text- font-medium text-gray-700">Upload Files to Bucket</label>
        <div
          {...getRootProps()}
          className={`w-full pt-8 pb-8 pl-4 pr-4 border-2 border-dashed rounded-lg cursor-pointer focus:outline-none ${
            isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center text-blue-500">
              <FontAwesomeIcon icon="upload" className="mr-2" />
              Drop your files!
            </p>
          ) : (
            <p className="text-center text-gray-500">
              <FontAwesomeIcon icon="upload" className="mr-2" />
              Drop zone - Add files to your bucket.
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {uploadingFiles.map((file) => (
          <UploadingFileItem key={file.id} file={file} deleteFile={handleDeleteFile} />
        ))}
        {files.map((file, index) => (
          <FileItem key={file.id} file={file} index={index} moveFile={handleMoveFile} deleteFile={handleDeleteFile} />
        ))}
      </div>
    </DndProvider>
  );
};

export default BucketUploader;
