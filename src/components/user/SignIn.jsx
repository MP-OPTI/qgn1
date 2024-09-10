// File: src/components/user/SignIn.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import CryptoJS from 'crypto-js';
import AuthForm from '../../components/user/form/AuthForm';
import FormInput from '../../components/user/form/FormInput';
import EmailVerificationLightbox from '../../components/user/EmailVerificationLightbox';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    
    if (storedEmail && storedPassword) {
      setEmail(CryptoJS.AES.decrypt(storedEmail, SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setPassword(CryptoJS.AES.decrypt(storedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setRememberMe(true);
    }
  }, []);

  const checkEmailVerification = async () => {
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload(); // Reload user to get the latest data
      if (!user.emailVerified) {
        setIsLightboxOpen(true); // Open the lightbox if the email is not verified
        return;
      }

      if (rememberMe) {
        localStorage.setItem('email', CryptoJS.AES.encrypt(email, SECRET_KEY).toString());
        localStorage.setItem('password', CryptoJS.AES.encrypt(password, SECRET_KEY).toString());
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in');
    }
  };

  return (
    <>
      <AuthForm title="Login" onSubmit={handleSignIn}>
        <FormInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <FormInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700">Remember Me</label>
        </div>
      </AuthForm>

      <EmailVerificationLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        checkEmailVerification={checkEmailVerification}
        message="You need to verify your email to sign in, please check your inbox..."
      />
    </>
  );
};

export default SignIn;
