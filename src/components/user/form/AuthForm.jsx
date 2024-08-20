// File: src/components/AuthForm.jsx
import React from 'react';

const AuthForm = ({ title, children, onSubmit }) => (
  <form onSubmit={onSubmit} className="max-w-sm mx-auto bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
      {title}
    </button>
  </form>
);

export default AuthForm;
