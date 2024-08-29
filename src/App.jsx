// File: src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Buckets = lazy(() => import('./pages/Buckets'));
const BucketView = lazy(() => import('./pages/BucketView'));

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Layout user={user}>
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
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
