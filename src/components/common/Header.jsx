import React from 'react';

const Header = ({ title, imageUrl }) => {
  return (
    <header className="bg-gray-800 text-white relative">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="Header background" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gray-950"></div>
          <div className="absolute inset-x-0 bottom-10 h-60 bg-gradient-to-t from-gray-950 to-transparent"></div>
        </div>
      )}
      <div className="container mx-auto px-4 py-14 relative z-10 flex justify-center items-center">
        <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-center">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
