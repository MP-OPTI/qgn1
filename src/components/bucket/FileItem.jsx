import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FileItem = ({ file, index, moveFile, deleteFile }) => {
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
    <div ref={(node) => dragRef(dropRef(node))} className="pt-4 pb-4 mb-1 bg-slate-100 rounded-lg cursor-move flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {file.type.startsWith('image/') ? (
            <img src={file.url} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <span className="truncate block w-full text-center">
              {file.name.length > 10 
                ? file.name.slice(0, 7) + '...' + file.name.split('.').pop().toUpperCase()
                : file.name.split('.').pop().toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p>{file.name}</p>
          <p className="text-sm text-gray-500">{file.type}</p>
        </div>
      </div>
      <button onClick={() => deleteFile(file.id, file.name)} className="mr-2 text-slate-400 p-2 rounded-lg hover:bg-red-600 hover:text-white w-8 h-8 flex items-center justify-center transition-all duration-200">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default FileItem;
