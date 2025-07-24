"use client";
import { useRef, useCallback, useEffect } from 'react';

export const useAutoScroll = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour vérifier si l'utilisateur est proche du bas
  const isNearBottom = useCallback((): boolean => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    // Pour ScrollArea de Radix, on doit aller chercher le viewport
    const viewport = container.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) return true;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Scroll vers le bas de manière robuste
  const scrollToBottom = useCallback((force: boolean = false) => {
    const endElement = messagesEndRef.current;
    const container = messagesContainerRef.current;
    
    if (!endElement || !container) return;

    // Pour ScrollArea, on doit récupérer le viewport
    const viewport = container.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) return;

    // Si l'utilisateur n'est pas proche du bas et qu'on ne force pas, ne pas scroller
    if (!force && !isNearBottom() && isUserScrollingRef.current) {
      return;
    }

    // Méthode 1: scrollIntoView (plus fiable)
    try {
      endElement.scrollIntoView({ 
        behavior: isUserScrollingRef.current ? 'auto' : 'smooth',
        block: 'nearest' 
      });
    } catch {
      // Fallback: scrollTop direct sur le viewport
      viewport.scrollTop = viewport.scrollHeight;
    }

    // Marquer que le scroll automatique est en cours
    isUserScrollingRef.current = false;
  }, [isNearBottom]);

  // Scroll immédiat sans animation
  const scrollToBottomInstant = useCallback(() => {
    const endElement = messagesEndRef.current;
    const container = messagesContainerRef.current;
    
    if (!endElement || !container) return;

    // Pour ScrollArea, on doit récupérer le viewport
    const viewport = container.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
    isUserScrollingRef.current = false;
  }, []);

  // Gérer le scroll utilisateur
  const handleUserScroll = useCallback(() => {
    isUserScrollingRef.current = true;
    
    // Reset après 2 secondes d'inactivité
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (isNearBottom()) {
        isUserScrollingRef.current = false;
      }
    }, 2000);
  }, [isNearBottom]);

  // Auto-scroll lors du premier chargement des messages
  const handleMessagesLoaded = useCallback((messages?: unknown[]) => {
    if (messages && messages.length > 0) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        scrollToBottomInstant();
      }, 50);
    }
  }, [scrollToBottomInstant]);

  // Auto-scroll lors de l'ajout d'un nouveau message
  const handleNewMessage = useCallback((isOwnMessage: boolean = false) => {
    // Pour ses propres messages, toujours scroller
    if (isOwnMessage) {
      setTimeout(() => {
        scrollToBottom(true);
      }, 100); // Délai un peu plus long pour s'assurer que le DOM est mis à jour
      return;
    }

    // Pour les messages des autres, scroller seulement si proche du bas
    if (isNearBottom() || !isUserScrollingRef.current) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
    }
  }, [scrollToBottom, isNearBottom]);

  // Nettoyer les timeouts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    messagesEndRef,
    messagesContainerRef,
    scrollToBottom,
    scrollToBottomInstant,
    handleUserScroll,
    handleMessagesLoaded,
    handleNewMessage,
    isNearBottom,
  };
};