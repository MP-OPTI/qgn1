import { ref, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import { toast } from 'react-toastify';

export const moveFile = (files, setFiles, dragIndex, hoverIndex) => {
  const newFiles = [...files];
  const [draggedFile] = newFiles.splice(dragIndex, 1);
  newFiles.splice(hoverIndex, 0, draggedFile);
  setFiles(newFiles);
};

export const deleteFile = async (user, files, setFiles, buckets, bucketId, fileId, fileName) => {
  try {
    const fileRef = ref(storage, `buckets/${user.uid}/${fileName}`);
    await deleteObject(fileRef);

    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);

    const userDocRef = doc(db, 'profiles', user.uid);
    await updateDoc(userDocRef, {
      buckets: buckets.map(bucket => 
        bucket.id === bucketId 
          ? { ...bucket, files: updatedFiles }
          : bucket
      )
    });

    toast.success(`File ${fileName} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error(`Error deleting file. Please try again.`);
  }
};
