import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddBucketButton = ({ addBucket }) => {
  return (
    <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50">
      <button 
          onClick={addBucket}
          className="mt-4 bg-indigo-500 text-white p-4 rounded-xl shadow-xl hover:bg-indigo-600 transition-all duration-200">
          <FontAwesomeIcon icon="plus" className="mr-2" />
          Add Another Bucket
      </button>
    </div>
  );
};

export default AddBucketButton;
