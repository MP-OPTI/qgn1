// File: src/components/ResetPasswordButton.jsx
import React from 'react';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const ResetPasswordButton = ({ email, buttonText = "Reset Password", className = "" }) => {
  
  const handleResetPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Please check your inbox.');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('Error sending password reset email. Please try again.');
      }
    } else {
      alert('Please provide a valid email address.');
    }
  };

  return (
    <button
      onClick={handleResetPassword}
      className={`bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 ${className}`}
    >
      {buttonText}
    </button>
  );
};

export default ResetPasswordButton;
