import { useEffect } from 'react';

const SecurityHeader = () => {
  useEffect(() => {
    // Add security headers via meta tags
    const addSecurityHeaders = () => {
      // Content Security Policy
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://kuoxpuxrmecjczqbvwsk.supabase.co https://api.openweathermap.org;";
      document.head.appendChild(csp);

      // X-Frame-Options
      const frameOptions = document.createElement('meta');
      frameOptions.httpEquiv = 'X-Frame-Options';
      frameOptions.content = 'DENY';
      document.head.appendChild(frameOptions);

      // X-Content-Type-Options
      const contentType = document.createElement('meta');
      contentType.httpEquiv = 'X-Content-Type-Options';
      contentType.content = 'nosniff';
      document.head.appendChild(contentType);

      // Referrer Policy
      const referrer = document.createElement('meta');
      referrer.name = 'referrer';
      referrer.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrer);
    };

    addSecurityHeaders();
  }, []);

  return null;
};

export default SecurityHeader;