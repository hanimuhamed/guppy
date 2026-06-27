import React from 'react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
  return (
    <div className="app-shell" style={{ overflowY: 'auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '16px' }}>
        When you sign in with Google, we collect basic profile information including your name, email address, and Google profile ID. We also store your gameplay progress, submitted code, and custom avatar preferences.
      </p>

      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '16px' }}>
        Your information is used solely to provide and improve the GetSetPixel experience. We do not sell your personal data to third parties.
      </p>

      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>3. Data Security</h2>
      <p style={{ marginBottom: '16px' }}>
        We employ industry-standard security measures to protect your data. By outsourcing authentication to Google, we ensure that your account credentials remain fully secured.
      </p>

      <div style={{ marginTop: '48px' }}>
        <Link to="/levels" className="ghost-button">← Back to App</Link>
      </div>
    </div>
  );
};
