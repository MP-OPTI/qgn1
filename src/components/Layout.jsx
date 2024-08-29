// File: src/components/Layout.jsx
import React from 'react';
import Navigation from './Navigation';

const LayoutComponent = ({ user, children }) => (
  <div className="min-h-screen bg-slate-950 text-text p-4 bg-cover bg-center bg-no-repeat bg-[url('">
    <Navigation user={user} />
    {children}
  </div>
);

const Layout = React.memo(LayoutComponent);

export default Layout;
