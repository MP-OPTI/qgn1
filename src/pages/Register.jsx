// src/pages/Register.jsx
import React from 'react';
import SignUp from '../components/user/SignUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <SignUp />
    </div>
  );
};

export default Register;
