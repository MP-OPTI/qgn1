// File: src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <Link to="/" className="text-blue-500 hover:underline">
        <FontAwesomeIcon icon="qrcode" className="mr-1" />
      </Link>
      {!user && (
        <Link to="/register" className="text-blue-500 hover:underline">
          <FontAwesomeIcon icon="user-plus" className="mr-1" />
        </Link>
      )}
      {user ? (
        <>
          <Link to="/buckets" className="text-blue-500 hover:underline">
            <FontAwesomeIcon icon="cubes" className="mr-1" />
          </Link>
          <Link to="/profile" className="text-blue-500 hover:underline">
            <FontAwesomeIcon icon="user" className="mr-1" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            <FontAwesomeIcon icon="sign-out-alt" className="mr-1" />
          </button>
        </>
      ) : (
        <Link to="/login" className="text-blue-500 hover:underline">
          <FontAwesomeIcon icon="sign-in-alt" className="mr-1" />
        </Link>
      )}
    </nav>
  );
  
});

export default Navigation;