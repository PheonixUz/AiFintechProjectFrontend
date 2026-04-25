import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Page not found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
};
