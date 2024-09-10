import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const UploadingFileItem = ({ file, deleteFile }) => (
  <div className="pt-4 pb-4 mb-1 bg-slate-100 rounded-lg flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        {file.type.startsWith('image/') ? (
          <img src={file.preview} alt={`Preview ${file.name}`} className="w-16 h-16 object-cover rounded-lg" />
        ) : (
          <span className="truncate block w-full text-center">
            {file.name.length > 10 
              ? file.name.slice(0, 7) + '...' + file.name.split('.').pop().toUpperCase()
              : file.name.split('.').pop().toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p>{file.name}</p>
        <p className="text-sm text-gray-500">{file.type}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${file.progress}%` }}></div>
        </div>
      </div>
    </div>
    <button onClick={() => deleteFile(file.id, file.name)} className="text-red-500 hover:text-red-700">
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </div>
);

export default UploadingFileItem;
