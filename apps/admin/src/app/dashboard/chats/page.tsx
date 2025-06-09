"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Send } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { CreateChatModal } from "@/modals/CreateChatModal";
import socket, { joinChat } from "@mrs/socket-client";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@mrs/socket-client";

type MessageFormInputs = z.infer<typeof messageSchema>;
const messageSchema = z.object({
  content: z.string().min(1, { message: "Le message ne peut pas être vide." }),
});

export default function Chats() {
  const userQuery = useUser();
  const userId = userQuery.data?.data?.user?.id || "";
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState<string>("");
  const createChatModal = useModal();
  const sendMessageform = useForm<MessageFormInputs>({
    resolver: zodResolver(messageSchema),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    joinChat(selectedChat);

    const handleNewMessage = (message: Message[]) => {
      const msg = message[0];
      if (msg?.chatId === selectedChat) {
        queryClient.setQueryData(
          ["messages", selectedChat],
          (old: Message[] | undefined) => {
            return old ? [...old, msg] : [msg];
          }
        );
        scrollToBottom();
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedChat, queryClient]);

  const chats = useChats();
  const messages = useMessages(selectedChat);
  const createMessage = useCreateMessage();

  const handleSubmitMessage = (e: React.FormEvent) => {
    sendMessageform.handleSubmit((data) => {
      createMessage?.mutate({
        json: {
          content: data?.content,
          chatId: selectedChat,
        },
      });
    })(e);
  };

  useEffect(() => {
    if (chats?.data?.length) setSelectedChat(chats.data[0].id);
  }, [chats?.data]);

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
                chats.data?.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex flex-row border-b p-5 space-x-3 w-full cursor-pointer",
                      selectedChat === chat.id && "bg-muted"
                    )}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium">{chat.title}</p>
                        <span className="text-xs text-muted-foreground">
                          NO DATA
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        NO DATA
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col h-full overflow-hidden border rounded-xl bg-background">
            <div className="border-b flex flex-row items-center justify-start p-3 space-x-3 sticky top-0 bg-background/70 backdrop-blur-md z-10 h-16">
              <MrsAvatar
                src={"/default-avatar.png"}
                className="text-primary"
                size={40}
                alt={selectedChatData?.title || ""}
                displayName={selectedChatData?.title?.slice(0, 2) || "C"}
              />
              <h3 className="text-lg font-medium">{selectedChatData?.title}</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-5">
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
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <Form {...sendMessageform}>
              <form
                onSubmit={handleSubmitMessage}
                className="border-t flex flex-row items-center justify-between p-3 space-x-3 sticky bottom-0 bg-background/70 backdrop-blur-md z-10 w-full "
              >
                <FormField
                  control={sendMessageform.control}
                  name="content"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <Input {...field} type="text" className="w-full" />
                      {fieldState.error?.message && (
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" className="h-11">
                  <Send className="w-4 h-4 fill-primary-foreground" /> Envoyer
                </Button>
              </form>
            </Form>
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
