// File: src/components/Layout.jsx
import React from 'react';
import Navigation from './Navigation';

const LayoutComponent = ({ user, children }) => (
  <div className="min-h-screen bg-gray-100 p-4">
    <Navigation user={user} />
    {children}
  </div>
);

const Layout = React.memo(LayoutComponent);

export default Layout;
