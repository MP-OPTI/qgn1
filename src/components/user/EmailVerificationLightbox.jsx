// File: src/components/user/EmailVerificationLightbox.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';

const EmailVerificationLightbox = ({ isOpen, onClose, checkEmailVerification, message }) => {
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const intervalId = setInterval(async () => {
        const result = await checkEmailVerification();
        setVerified(result);
        if (result) {
          clearInterval(intervalId);
          setTimeout(onClose, 2000);
        }
      }, 5000); // Checks every 5 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount or close
    }
  }, [isOpen, checkEmailVerification, onClose]);

  const handleResendVerification = async () => {
    try {
      setResending(true);
      await sendEmailVerification(auth.currentUser);
      alert('Verification email resent. Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      alert('Error resending verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="p-12 bg-slate-900/60 backdrop-blur-lg rounded-lg shadow-lg text-center text-white inline-flex items-center">
        {!verified ? (
          <>
            <div className="relative flex space-x-2 z-10">
              <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse1"></div>
              <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse2"></div>
              <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse3"></div>
            </div>
            <p className="relative ml-4 z-10">{message}</p>
            <button
              onClick={handleResendVerification}
              className={`ml-4 z-10 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ${resending ? 'opacity-50' : ''}`}
              disabled={resending}
            >
              {resending ? 'Resending...' : 'Resend verification email'}
            </button>
          </>
        ) : (
          <>
            <div className="relative text-green-500 text-2xl z-10"><FontAwesomeIcon icon={faCheck} /></div>
            <p className="relative ml-4 z-10">Email verified!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationLightbox;
