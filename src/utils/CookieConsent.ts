// hooks/useCookieConsent.ts
import { useEffect, useState } from "react";

export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookieConsent='))
        ?.split('=')[1];
      
      setHasConsent(consent === 'true');
    };

    // Initial check
    checkConsent();

    // Check periodically in case cookies change
    const interval = setInterval(checkConsent, 1000);
    return () => clearInterval(interval);
  }, []);

  return hasConsent;
};