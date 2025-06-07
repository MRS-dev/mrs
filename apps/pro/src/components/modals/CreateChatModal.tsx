import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModalProps } from "@/hooks/useModale";
import { useCreateChat } from "@/queries/chats/useCreateChat";
import { queryKeys } from "@/queries/queryKeys";
import { useUser } from "@/queries/user/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createChatSchema = z.object({
  title: z.string().min(2),
  receivedId: z.string().min(2),
});

type CreateChatFormInputs = z.infer<typeof createChatSchema>;

export const CreateChatModal = (props: ModalProps) => {
  const form = useForm<CreateChatFormInputs>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      title: "",
      receivedId: "",
    },
  });

  const queryClient = useQueryClient();
  const createChat = useCreateChat({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats(),
      });
    },
  });

  const userQuery = useUser();
  const userId = userQuery.data?.data?.user?.id || "";

  const onSubmit = (data: CreateChatFormInputs) => {
    createChat.mutate({
      json: {
        title: data.title,
        participants: [userId, data?.receivedId],
      },
    });
  };
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une demande de kiné</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <Input {...field} type="text" className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="receivedId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Destinataire</FormLabel>
                  <Input {...field} type="text" className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="secondary"
                size="lg"
                type="button"
                onClick={() => props.onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                size="lg"
                type="submit"
                disabled={createChat.isPending}
              >
                {createChat.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
