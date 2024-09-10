import React from 'react';
import SignUp from '../components/user/SignUp';

const Register = () => {
  return (
    <div className="mt-12 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <SignUp />
    </div>
  );
};

export default Register;
