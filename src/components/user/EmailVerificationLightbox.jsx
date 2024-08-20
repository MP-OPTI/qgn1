// File: src/components/user/EmailVerificationLightbox.jsx
import React, { useState, useEffect } from 'react';

const EmailVerificationLightbox = ({ isOpen, onClose, checkEmailVerification }) => {
  const [verified, setVerified] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {!verified ? (
          <>
            <div className="loader"></div>
            <p className="mt-4">Checking for email verification, please check your inbox...</p>
          </>
        ) : (
          <>
            <div className="check-icon">✔️</div>
            <p className="mt-4">Email verified!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationLightbox;

