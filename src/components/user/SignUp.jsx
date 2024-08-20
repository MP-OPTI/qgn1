// File: src/components/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AuthForm from '../../components/user/form/AuthForm';
import FormInput from '../../components/user/form/FormInput';
import EmailVerificationLightbox from '../../components/user/EmailVerificationLightbox';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "profiles", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      });

      await sendEmailVerification(user);
      setIsLightboxOpen(true);
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up");
    }
  };

  const checkEmailVerification = async () => {
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
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
          navigate('/profile');
        }}
        checkEmailVerification={checkEmailVerification}
      />
    </>
  );
};

export default SignUp;
