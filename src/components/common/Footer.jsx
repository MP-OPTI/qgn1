import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="max-w-md w-full m-auto my-40 p-8 rounded-lg bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p>&copy; {currentYear} Morten Pradsgaard. All rights reserved.</p>
        <nav>
          {/* <ul className="flex space-x-4">
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul> */}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
