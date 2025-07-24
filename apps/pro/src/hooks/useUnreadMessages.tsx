"use client";
import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Chat, Message } from '@mrs/socket-client';
import { onNewMessage, offNewMessage } from '@mrs/socket-client';

export const useUnreadMessages = (selectedChatId?: string) => {
  const queryClient = useQueryClient();
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Mettre à jour le compteur de messages non lus pour un chat
  const updateUnreadCount = useCallback((chatId: string, count: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: count
    }));
  }, []);

  // Incrémenter le compteur quand un nouveau message arrive
  const incrementUnreadCount = useCallback((chatId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1
    }));
  }, []);

  // Marquer un chat comme lu (remettre le compteur à 0)
  const markChatAsRead = useCallback(async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/mark-read`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));

        // Invalider et refetch les chats pour mettre à jour l'UI
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, [queryClient]);

  // Initialiser les compteurs depuis les données des chats
  const initializeUnreadCounts = useCallback((chats: Chat[]) => {
    const counts: Record<string, number> = {};
    chats.forEach(chat => {
      counts[chat.id] = chat.unreadCount || 0;
    });
    setUnreadCounts(counts);
  }, []);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message?.chatId) {
        // N'incrémenter que si l'utilisateur n'est PAS dans ce chat actuellement
        if (message.chatId !== selectedChatId) {
          incrementUnreadCount(message.chatId);
        }
        
        // Invalider les queries pour mettre à jour la liste des chats
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage();
    };
  }, [incrementUnreadCount, queryClient, selectedChatId]);

  // Calculer le total de messages non lus
  const totalUnreadCount = Object.values(unreadCounts).reduce((total, count) => total + count, 0);

  return {
    unreadCounts,
    totalUnreadCount,
    updateUnreadCount,
    markChatAsRead,
    initializeUnreadCounts,
    incrementUnreadCount,
  };
};