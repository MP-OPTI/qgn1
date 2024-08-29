// File: src/components/user/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AuthForm from '../../components/user/form/AuthForm';
import FormInput from '../../components/user/form/FormInput';
import EmailVerificationLightbox from '../../components/user/EmailVerificationLightbox';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [temporaryUser, setTemporaryUser] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if displayName is empty
    if (!displayName.trim()) {
      alert('Display Name is required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'profiles', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      });

      await sendEmailVerification(user);
      setTemporaryUser({ email, password }); // Store email and password temporarily for checking status
      setIsLightboxOpen(true);

      await signOut(auth);

    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  };

  return (
    <>
      <AuthForm title="Sign Up" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
      </AuthForm>

      <EmailVerificationLightbox
        isOpen={isLightboxOpen}
        onClose={() => {
          setIsLightboxOpen(false);
          navigate('/login'); // Redirect to the login page after closing the lightbox
        }}
        checkEmailVerification={async () => {
          if (temporaryUser) {
            try {
              // Sign in silently to check verification
              const userCredential = await signInWithEmailAndPassword(
                auth,
                temporaryUser.email,
                temporaryUser.password
              );
              const user = userCredential.user;
              await user.reload(); // Reload user data
              return user.emailVerified; // Return verification status
            } catch (error) {
              console.error('Error checking email verification:', error);
              return false;
            }
          }
          return false;
        }}
        message="Registration successful! Please check your inbox to verify your email before logging in."
      />
    </>
  );
};

export default SignUp;
