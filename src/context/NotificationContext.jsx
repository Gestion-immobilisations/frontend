import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

const MAX_STORED = 50;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('app_notifications');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addNotification = useCallback((message, type = 'info') => {
    const entry = {
      id: Date.now(),
      message,
      type,
      read: false,
      time: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const next = [entry, ...prev].slice(0, MAX_STORED);
      localStorage.setItem('app_notifications', JSON.stringify(next));
      return next;
    });
    return entry;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('app_notifications', JSON.stringify(next));
      return next;
    });
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const notify = useMemo(
    () => ({
      success: (message) => {
        toast.success(message, { className: 'toast-custom' });
        addNotification(message, 'success');
      },
      error: (message) => {
        toast.error(message, { className: 'toast-custom' });
        addNotification(message, 'error');
      },
      info: (message) => {
        toast(message, { className: 'toast-custom' });
        addNotification(message, 'info');
      },
      panneDeclaree: () => {
        const msg = 'Panne déclarée avec succès.';
        toast.success(msg, { className: 'toast-custom', icon: '🔧' });
        addNotification(msg, 'panne');
      },
      maintenancePlanifiee: () => {
        const msg = 'Maintenance planifiée avec succès.';
        toast.success(msg, { className: 'toast-custom', icon: '📅' });
        addNotification(msg, 'maintenance');
      },
      stockFaible: (designation) => {
        const msg = `Stock faible : ${designation}`;
        toast(msg, { className: 'toast-custom', icon: '⚠️', style: { background: '#fef3c7', color: '#92400e' } });
        addNotification(msg, 'stock');
      },
      interventionEnregistree: () => {
        const msg = 'Intervention enregistrée avec succès.';
        toast.success(msg, { className: 'toast-custom', icon: '✅' });
        addNotification(msg, 'intervention');
      },
    }),
    [addNotification]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      notify,
      markAllRead,
    }),
    [notifications, unreadCount, notify, markAllRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications doit être utilisé dans NotificationProvider');
  }
  return ctx;
};

export default NotificationContext;
