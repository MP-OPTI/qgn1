// File: src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navigation = React.memo(({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    navigate('/');
  };

  return (
    <nav className="flex justify-center space-x-4 mb-6">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link>
      {!user && (
        <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
      )}
      {user ? (
        <>
          <Link to="/profile" className="text-blue-500 hover:underline">Profile</Link>
          <Link to="/users" className="text-blue-500 hover:underline">Users</Link>
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      )}
    </nav>
  );
});

export default Navigation;