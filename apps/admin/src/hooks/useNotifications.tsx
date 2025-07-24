"use client";
import { useState, useEffect, useCallback } from 'react';
import { onNewNotification, offNewNotification } from '@mrs/socket-client';
import type { Notification } from '@mrs/socket-client';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Afficher un toast pour la nouvelle notification
    toast(notification.title, {
      description: notification.content,
      action: notification.data?.actionLabel ? {
        label: notification.data.actionLabel,
        onClick: () => {
          // Gérer l'action de la notification
          if (notification.data?.actionUrl) {
            window.location.href = notification.data.actionUrl;
          }
        },
      } : undefined,
    });
  }, []);

  const markAsRead = useCallback((notificationId: string | 'all') => {
    setNotifications(prev => {
      if (notificationId === 'all') {
        return prev.map(n => ({ ...n, isRead: true }));
      }
      return prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
    });
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      console.log("Nouvelle notification reçue:", notification);
      addNotification(notification);
    };

    onNewNotification(handleNewNotification);

    return () => {
      offNewNotification();
    };
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnreadNotifications = unreadCount > 0;

  return {
    notifications,
    addNotification,
    markAsRead,
    removeNotification,
    unreadCount,
    hasUnreadNotifications,
  };
};