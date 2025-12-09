import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const GTM_ID = 'GTM-TLVPQ9VN';

const loadGTM = () => {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', GTM_ID);
};

const updateGtagConsent = (status) => {
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status
    });
  }
};

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    
    if (consent === 'accepted') {
      updateGtagConsent('granted');
      loadGTM();
      setShow(false);
    } else if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    updateGtagConsent('granted');
    loadGTM(); 
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-consent-banner">
      <p className="cookie-consent-text">
        We use cookies to improve your experience. You can accept or reject non-essential cookies.
      </p>
      <div className="cookie-consent-buttons">
        <button 
          className="cookie-consent-button cookie-consent-accept" 
          onClick={handleAccept}>
          Accept
        </button>
        <button 
          className="cookie-consent-button cookie-consent-reject" 
          onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
}