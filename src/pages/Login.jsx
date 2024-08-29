// File: src/pages/Login.jsx
import React, { useState } from 'react';
import SignIn from '../components/user/SignIn';
import ResetPasswordButton from '../components/user/ResetPasswordButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {
  const [email, setEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <SignIn />

      {!showResetPassword ? (
        <p className="mt-4">
          <button
            onClick={() => setShowResetPassword(true)}
            className="text-blue-500 hover:underline"
          >
            Forgot your password?
          </button>
        </p>
      ) : (
        <div className="mt-4">
          <input
            type="email"
            placeholder="Enter your email to reset password"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
          <ResetPasswordButton email={email} buttonText="Send Password Reset Email" className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default Login;
