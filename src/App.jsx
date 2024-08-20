// File: src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Layout from './components/Layout';
import useAuth from './hooks/useAuth';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const UsersList = lazy(() => import('./pages/UsersList'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  const user = useAuth();

  return (
    <Router>
      <Layout user={user}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
