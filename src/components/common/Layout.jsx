// File: src/components/Layout.jsx
import React, { useRef, useEffect, useState } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';

const LayoutComponent = ({ user, children, pageTitle, headerImage }) => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && navRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setIsNavFixed(headerBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <div ref={headerRef}>
        <Header title={pageTitle} imageUrl={headerImage} />
      </div>
      <div ref={navRef} style={{ height: isNavFixed ? navRef.current?.offsetHeight : 0 }} />
      <Navigation user={user} isFixed={isNavFixed} />
      <main className="flex-grow p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const Layout = React.memo(LayoutComponent);

export default Layout;
