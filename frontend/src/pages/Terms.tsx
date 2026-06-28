import React from 'react';
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
  return (
    <div className="app-shell" style={{ overflowY: 'auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Terms of Service</h1>
      <p style={{ marginBottom: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
      <p style={{ marginBottom: '16px' }}>
        By accessing and using Guppy, you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>2. User Accounts</h2>
      <p style={{ marginBottom: '16px' }}>
        To use certain features of the platform, you must register for an account using Google Authentication. You are responsible for maintaining the confidentiality of your account. You may choose to permanently delete your account at any time through your Profile settings.
      </p>

      <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>3. Acceptable Use</h2>
      <p style={{ marginBottom: '16px' }}>
        You agree not to use the platform to submit malicious code, attempt to bypass security measures, or harass other users.
      </p>

      <div style={{ marginTop: '48px' }}>
        <Link to="/levels" className="ghost-button">← Back to App</Link>
      </div>
    </div>
  );
};
