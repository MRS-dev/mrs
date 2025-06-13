import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
//import { useToast } from "@/hooks/use-toast";
import { ModalProps } from "@/hooks/useModale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MrsModal, MrsModalContent, MrsModalTitle } from "../mrs/MrsModal";
//import { useUpdateAd } from "@/queries/ads/useUpdateAd";
import { useCreateAd } from "@/queries/ads/useCreateAd";
import { queryKeys } from "@/queries/queryKeys";
import { useUser } from "@/queries/user/useUser";

interface CreateAdModalProps extends ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createAdSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  url: z.string(),
  enable: z.boolean().optional(),
  photoUrl: z.string().min(1),
  authorId: z.boolean().optional(),
});

export type CreateAdFormInputs = z.infer<typeof createAdSchema>;

export const CreateAdModal = (props: CreateAdModalProps) => {
  const userQuery = useUser();
  const userId = userQuery.data?.data?.user?.id || "";

  const queryClient = useQueryClient();
  //const { toast } = useToast();
  const form = useForm<CreateAdFormInputs>({
    resolver: zodResolver(createAdSchema),
  });

  // const updateAdMutation = useUpdateAd({
  //   onSuccess: () => {
  //     form.reset();
  //     queryClient.invalidateQueries({ queryKey: queryKeys.ads() });
  //     props.onClose();
  //   },
  // });

  const createAdMutation = useCreateAd({
    onSuccess: () => {
      // toast({
      //   title: "Publicité créé avec succès",
      //   description: "La publicité a été créé avec succès",
      //   variant: "success",
      // });
      form.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.ads() });
      props.onClose();
    },
    onError: () => {
      // toast({
      //   title: "Une erreur est survenue",
      //   description:
      //     "Une erreur est survenue lors de la création de la publicité",
      //   variant: "destructive",
      // });
    },
  });

  const handleSubmitAd = (e: React.FormEvent) => {
    form.handleSubmit((data) => {
      const ad = { ...data, authorId: userId, photoUrl: data.photoUrl ?? "" };
      createAdMutation.mutate({
        json: ad,
      });
    })(e);
  };

  return (
    <>
      <MrsModal {...props}>
        <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[90vh] overflow-auto">
          <div className="flex flex-row items-center justify-between gap-4 px-4 py-2 sticky top-0 bg-background/70 backdrop-blur-sm border-b z-10">
            <MrsModalTitle>Créer une publicité</MrsModalTitle>
            <Button variant="ghost" size="sm" onClick={() => props.onClose()}>
              <X className="size-4" />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmitAd}>
              <div className="flex flex-col gap-4 p-4">
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Textarea {...field} className="!mt-1" />
                      {fieldState.error?.message && (
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Url de redirection</FormLabel>
                      <Input {...field} type="text" className="!mt-1" />
                      {fieldState.error?.message && (
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Url de l{"' "}image</FormLabel>
                      <Input {...field} type="text" className="!mt-1" />
                      {fieldState.error?.message && (
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-end gap-2 px-4 py-2 sticky bottom-0 bg-background/70 backdrop-blur-sm border-t z-10">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => props.onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={createAdMutation.isPending}
                >
                  {createAdMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Créer"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </MrsModalContent>
      </MrsModal>
    </>
  );
};
