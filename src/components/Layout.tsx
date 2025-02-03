import React, { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Powder Coating Pro</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="py-6 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Powder Coating Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 