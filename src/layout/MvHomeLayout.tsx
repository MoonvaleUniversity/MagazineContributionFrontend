import React, { ReactNode } from 'react';
import { MvNavbar } from '../components/MvNavbar';
import { MvThemeToggle } from '../components/MvThemeToggle';
import { MvFooter } from '../components/MvFooter';
import { CookieConsentModal } from '../components/MvCookieConsent/MvCookieConsent';

interface HomeLayoutProps {
  children: ReactNode;
}

const MvHomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      
      <MvNavbar />
      <main className=" flex-grow  w-screen top-16">
        {children}
      </main>
      
      <MvFooter />
      <MvThemeToggle />
      <CookieConsentModal />
    </div>
  );
};

export default MvHomeLayout;