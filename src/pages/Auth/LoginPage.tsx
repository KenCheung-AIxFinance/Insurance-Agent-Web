import React from 'react';
import EmailGoogleAuth from './components/EmailGoogleAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/'); // Redirect to home page after successful login
  };

  return (
    <div className="relative flex items-center justify-center h-full">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(40%_30%_at_20%_20%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(30%_30%_at_80%_10%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(50%_40%_at_50%_100%,hsl(var(--primary)/0.06),transparent_60%)]" />
      <div className="w-full max-w-md p-6">
        <EmailGoogleAuth onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
