// File: src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navigation = React.memo(({ user, isFixed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`${isFixed ? 'fixed top-2 left-0 right-0' : 'absolute left-0 right-0 top-40'} flex justify-center z-50 px-6`}>
      <div className="max-w-sm w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300">
        <nav className="h-16 flex items-center justify-center space-x-4 px-4">
          <Link to="/" className={`text-2xl hover:underline ${isActive('/') ? 'text-indigo-500' : 'text-white'}`}>
            <FontAwesomeIcon icon="qrcode" className="mr-3"/>
          </Link>
          {!user && (
            <Link to="/register" className={`hover:underline ${isActive('/register') ? 'text-indigo-500' : 'text-white'}`}>
              <FontAwesomeIcon icon="user-plus" className="mr-3" />
            </Link>
          )}
          {user ? (
            <>
              <Link to="/buckets" className={`mr-3 text-2xl hover:underline ${isActive('/buckets') ? 'text-indigo-500' : 'text-white'}`}>
                <FontAwesomeIcon icon="cubes" className="mr-3" />
              </Link>
              <Link to="/profile" className={`mr-3 hover:underline ${isActive('/profile') ? 'text-indigo-500' : 'text-white'}`}>
                <FontAwesomeIcon icon="user" className="mr-3" />
              </Link>
              <Link to="/monday-board" className={`mr-3 hover:underline ${isActive('/monday-board') ? 'text-indigo-500' : 'text-white'}`}>
                <FontAwesomeIcon icon="tasks" className="mr-3" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-2xl hover:underline focus:outline-none"
              >
                <FontAwesomeIcon icon="sign-out-alt" className="mr-3" />
              </button>
            </>
          ) : (
            <Link to="/login" className={`text-2xl hover:underline ${isActive('/login') ? 'text-indigo-500' : 'text-white'}`}>
              <FontAwesomeIcon icon="sign-in-alt" className="mr-3"/>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
});

export default Navigation;