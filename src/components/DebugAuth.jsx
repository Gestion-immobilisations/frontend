// frontend/src/components/DebugAuth.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugAuth = () => {
  const { user, authenticated, hasRole } = useAuth();
  const storedUser = localStorage.getItem('user');
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#333', color: '#0f0', padding: '10px', fontSize: '12px', zIndex: 9999 }}>
      <div>🔐 Auth: {authenticated ? '✅' : '❌'}</div>
      <div>👤 User: {user?.email || 'none'}</div>
      <div>🎭 Roles: {JSON.stringify(user?.roles || [])}</div>
      <div>💾 Storage: {storedUser ? JSON.parse(storedUser)?.roles?.join(',') : 'none'}</div>
      <div>🔑 hasRole(ADMIN): {hasRole('ADMIN') ? '✅' : '❌'}</div>
    </div>
  );
};

export default DebugAuth;