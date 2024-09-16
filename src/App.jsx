// File: src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import headerImage from './assets/6675303.svg';  // Import the image
import MondayBoard from './pages/MondayBoard';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Buckets = lazy(() => import('./pages/Buckets'));
const BucketView = lazy(() => import('./pages/BucketView'));

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Layout user={user} pageTitle="QR QR QR" headerImage={headerImage}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />  {/* Home route */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/buckets" element={
              <ProtectedRoute>
                <Buckets />
              </ProtectedRoute>
            } />
            <Route path="/bucket/:userId/:bucketId" element={<BucketView />} />
            <Route path="/monday-board" element={
              <ProtectedRoute>
                <MondayBoard />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
