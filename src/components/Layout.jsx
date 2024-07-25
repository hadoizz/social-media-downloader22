import React from 'react';
import Navber from './Navber';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navber />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
