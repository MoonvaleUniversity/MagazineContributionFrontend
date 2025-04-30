import { useState, useEffect } from "react";
import { MvButton } from "../MvButton";
import { MvModal } from "../MvModal";


export const CookieConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if consent cookie exists
  const getConsentCookie = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('cookieConsent='))
      ?.split('=')[1];
  };

  useEffect(() => {
    // Only show modal if consent hasn't been given
    if (!getConsentCookie()) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie for 1 year
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `cookieConsent=true; expires=${date.toUTCString()}; path=/`;
    setIsOpen(false);
  };

  const handleDecline = () => {
    // Set session cookie that expires when browser closes
    document.cookie = 'cookieConsent=false; path=/';
    setIsOpen(false);
  };

  return (
    <MvModal 
    title="Cookie Consent"
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      className="max-w-md"
      hideCloseButton
    >
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Cookie Consent</h3>
        <p className="text-gray-600 dark:text-gray-300">
          We use cookies to enhance your experience. By continuing to visit this site, 
          you agree to our use of cookies.
        </p>
        <div className="flex gap-4">
          <MvButton 
            onClick={handleAccept}
            variant="primary"
            className="flex-1"
          >
            Accept All
          </MvButton>
          <MvButton
            onClick={handleDecline}
            variant="secondary"
            className="flex-1"
          >
            Decline
          </MvButton>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Learn more in our{' '}
          <a 
            href="/privacy-policy" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </MvModal>
  );
};