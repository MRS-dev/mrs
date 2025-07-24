"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Send, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useModal } from "@/hooks/useModale";
import { useUser } from "@/queries/user/useUser";
import { useChats } from "@/queries/chats/useChats";
import { useMessages } from "@/queries/messages/useMessages";
import { useCreateMessage } from "@/queries/messages/useCreateMessage";
import { timeAgo } from "@/lib/date";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { formatMessageTime, truncateMessage } from "@/lib/dateUtils";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { CreateChatModal } from "@/components/modals/CreateChatModal";
import { Skeleton } from "@/components/ui/skeleton";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import socket, { joinChat, joinUserRoom } from "@mrs/socket-client";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@mrs/socket-client";
const messageSchema = z.object({
  content: z.string().min(1, { message: "Le message ne peut pas être vide." }),
});
type MessageFormInputs = z.infer<typeof messageSchema>;

export default function Chats() {
  const userQuery = useUser();
  const userId = userQuery.data?.data?.user?.id || "";
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState<string>("");
  const createChatModal = useModal();
  const sendMessageform = useForm<MessageFormInputs>({
    resolver: zodResolver(messageSchema),
  });
  const { unreadCounts, markChatAsRead, initializeUnreadCounts } = useUnreadMessages(selectedChat);
  const {
    messagesEndRef,
    messagesContainerRef,
    handleUserScroll,
    handleMessagesLoaded,
    handleNewMessage,
  } = useAutoScroll();

  useEffect(() => {
    socket.connect();
    
    // Rejoindre la room utilisateur pour les notifications
    if (userId) {
      joinUserRoom(userId);
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!selectedChat) return;
    joinChat(selectedChat);

    const handleNewSocketMessage = (message: Message) => {
      if (message?.chatId === selectedChat) {
        queryClient.setQueryData(
          ["messages", selectedChat],
          (old: Message[] | undefined) => {
            return old ? [...old, message] : [message];
          }
        );
        // Auto-scroll pour les nouveaux messages (pas nos propres messages)
        handleNewMessage(message?.senderId === userId);
      }
    };

    socket.on("newMessage", handleNewSocketMessage);
    return () => {
      socket.off("newMessage", handleNewSocketMessage);
    };
  }, [selectedChat, queryClient, handleNewMessage, userId]);

  const chats = useChats();
  const messages = useMessages(selectedChat);
  const createMessage = useCreateMessage();

  // Initialiser les compteurs de messages non lus quand les chats sont chargés
  useEffect(() => {
    if (chats.data) {
      initializeUnreadCounts(chats.data);
    }
  }, [chats.data, initializeUnreadCounts]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    sendMessageform.handleSubmit((data) => {
      createMessage?.mutate({
        json: {
          content: data?.content,
          chatId: selectedChat,
        },
      }, {
        onSuccess: () => {
          // Scroll immédiat après envoi de son propre message
          handleNewMessage(true);
          // Mettre à jour la liste des chats pour afficher le dernier message
          queryClient.invalidateQueries({ queryKey: ["chats"] });
        }
      });
      // Réinitialiser le formulaire après envoi
      sendMessageform.reset();
    })(e);
  };

  useEffect(() => {
    if (chats?.data?.length) {
      setSelectedChat(chats.data[0].id);
    }
  }, [chats?.data]);

  // Marquer le chat comme lu quand on le sélectionne
  useEffect(() => {
    if (selectedChat && unreadCounts[selectedChat] > 0) {
      markChatAsRead(selectedChat);
    }
  }, [selectedChat, markChatAsRead, unreadCounts]);

  // Auto-scroll quand les messages sont chargés
  useEffect(() => {
    if (messages.data && messages.data.length > 0) {
      handleMessagesLoaded(messages.data);
    }
  }, [messages.data, handleMessagesLoaded]);

  const selectedChatData = useMemo(
    () => chats.data?.find((chat) => chat.id === selectedChat),
    [chats.data, selectedChat]
  );

  return (
    <>
      <CreateChatModal {...createChatModal} />
      <SidebarLayout
        className="overflow-hidden h-screen bg-muted/50"
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Messagerie</h1>
              <Button
                variant="default"
                onClick={() => createChatModal.onOpenChange(true)}
              >
                <Plus /> Nouveau chat
              </Button>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="flex flex-row flex-1 overflow-hidden p-4 gap-3">
          <div className="flex flex-col w-96 max-w-1/2 border rounded-xl bg-background">
            <div className="border-b px-3 flex items-center flex-row h-16 w-full">
              <div className="relative w-full">
                <Input className="pl-10" placeholder="Rechercher" />
                <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground " />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              {chats.isLoading ? (
                <ChatsSkeleton />
              ) : (
                chats.data?.map((chat) => {
                  const hasUnreadMessages = (unreadCounts[chat.id] || chat.unreadCount || 0) > 0;
                  const isCurrentUser = chat.lastMessageSenderId === userId;
                  
                  return (
                    <div
                      key={chat.id}
                      className={cn(
                        "flex flex-row border-b p-5 space-x-3 w-full cursor-pointer transition-colors",
                        selectedChat === chat.id && "bg-muted",
                        chat.isSupport && "border-l-4 border-l-orange-500",
                        hasUnreadMessages && "bg-blue-50/50 border-l-4 border-l-blue-500"
                      )}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start mt-1">
                        {chat.isSupport ? (
                          <Headphones className="w-4 h-4 text-orange-500" />
                        ) : (
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "text-sm",
                              hasUnreadMessages ? "font-bold" : "font-medium"
                            )}>
                              {chat.title}
                            </p>
                            {chat.isSupport && (
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                Support
                              </span>
                            )}
                            {hasUnreadMessages && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                {unreadCounts[chat.id] || chat.unreadCount}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(chat.lastMessageCreatedAt || chat.lastUpdated)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm truncate",
                          hasUnreadMessages ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          {isCurrentUser && chat.lastMessageContent && "Vous: "}
                          {truncateMessage(chat.lastMessageContent) || "Aucun message pour l'instant"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col h-full overflow-hidden border rounded-xl bg-background">
            {/* Header fixe */}
            <div className="border-b flex flex-row items-center justify-start p-3 space-x-3 bg-background z-10 h-16 shrink-0">
              <MrsAvatar
                src={"/default-avatar.png"}
                className="text-primary"
                size={40}
                alt={selectedChatData?.title || ""}
                displayName={selectedChatData?.title?.slice(0, 2) || "C"}
              />
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{selectedChatData?.title}</h3>
                {selectedChatData?.isSupport && (
                  <>
                    <Headphones className="w-4 h-4 text-orange-500" />
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Support
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Zone des messages avec scroll */}
            <ScrollArea 
              className="flex-1 min-h-0" 
              ref={messagesContainerRef}
              onScrollCapture={handleUserScroll}
            >
              <div className="p-5 pb-4">
                {messages.isLoading ? (
                  <p>Chargement des messages...</p>
                ) : (
                  messages.data?.map((message) => (
                    <div
                      key={message?.id}
                      className={`flex mb-4 ${message?.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={cn(
                          "max-w-96 p-3 rounded-xl relative",
                          message?.senderId === userId
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        )}
                      >
                        <p>{message?.content}</p>
                        <span className="text-xs mt-1 block text-right">
                          {timeAgo(message?.createdAt)}
                        </span>
                        <div
                          className={cn(
                            "absolute inline-block w-0 h-0 top-full",
                            message?.senderId === userId
                              ? "right-0 border-t-8 border-t-primary border-l-8 border-l-transparent"
                              : "left-0 border-t-8 border-t-muted border-r-8 border-r-transparent"
                          )}
                        />
                      </div>
                    </div>
                  ))
                )}
                {/* Spacer pour éviter que le dernier message soit caché par l'input */}
                <div className="h-20" />
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Formulaire d'envoi fixe en bas */}
            <div className="border-t bg-background shrink-0">
              <Form {...sendMessageform}>
                <form
                  onSubmit={handleSubmitMessage}
                  className="flex flex-row items-center justify-between p-3 space-x-3 w-full"
                >
                  <FormField
                    control={sendMessageform.control}
                    name="content"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <Input {...field} type="text" className="w-full" placeholder="Tapez votre message..." />
                        {fieldState.error?.message && (
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="default" className="h-11" disabled={!sendMessageform.watch("content")?.trim()}>
                    <Send className="w-4 h-4 fill-primary-foreground" /> Envoyer
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
}

const ChatsSkeleton = () => (
  <div className="flex flex-col">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex flex-row p-5 space-x-3 w-full cursor-pointer"
      >
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="w-24 h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
