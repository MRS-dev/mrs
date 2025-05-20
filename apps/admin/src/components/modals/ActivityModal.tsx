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
import { ModalProps, useModal } from "@/hooks/useModale";
import { queryKeys } from "@/queries/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { MrsModal, MrsModalContent, MrsModalTitle } from "../mrs/MrsModal";
import { z } from "zod";
import { useCreateActivity } from "@/queries/activities/useCreateActivity";
import { useEffect } from "react";
import { useActivity } from "@/queries/activities/useActivity";
import { useDeleteActivity } from "@/queries/activities/useDeleteActivity";
import { useUpdateActivity } from "@/queries/activities/useUpdateActivity";
import { MrsConfirmationModal } from "../mrs/MrsConfirmationModal";

const activitySchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
});
interface ActivityModalProps extends ModalProps {
  activityId: string;
}
export const ActivityModal = (props: ActivityModalProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const activityQuery = useActivity(props.activityId);

  useEffect(() => {
    if (activityQuery.data) {
      form.reset({
        title: activityQuery.data?.title,
        description: activityQuery.data?.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityQuery.data]);
  const confirmationModal = useModal();
  const deleteActivityMutation = useDeleteActivity({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
      props.onClose();
      confirmationModal.onClose();
    },
  });
  const updateActivityMutation = useUpdateActivity({
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
      props.onClose();
    },
  });

  const createActivityMutation = useCreateActivity({
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
      props.onClose();
    },
  });
  const onSubmit = async (json: z.infer<typeof activitySchema>) => {
    if (props.activityId === "new") {
      createActivityMutation.mutate({ json });
    } else {
      updateActivityMutation.mutate({ json, param: { id: props.activityId } });
    }
  };

  return (
    <>
      <MrsModal {...props}>
        <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[90vh] overflow-auto">
          <div className="flex flex-row items-center justify-between gap-4 px-4 py-2 sticky top-0 bg-background/70 backdrop-blur-sm border-b z-10">
            <MrsModalTitle>Activité</MrsModalTitle>
            <Button variant="ghost" size="sm" onClick={() => props.onClose()}>
              <X className="size-4" />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
              </div>
              <div className="flex flex-row items-center justify-end gap-2 px-4 py-2 sticky bottom-0 bg-background/70 backdrop-blur-sm border-t z-10">
                {!(props.activityId === "new") && (
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      confirmationModal.onOpen();
                    }}
                  >
                    Supprimer
                  </Button>
                )}
                {props.activityId !== "new" ? (
                  <Button
                    type="submit"
                    disabled={updateActivityMutation.status === "pending"}
                  >
                    {updateActivityMutation.status === "pending" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Mettre à jour"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createActivityMutation.status === "pending"}
                  >
                    {createActivityMutation.status === "pending" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Créer"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </MrsModalContent>
      </MrsModal>
      <MrsConfirmationModal
        {...confirmationModal}
        title="Supprimer l'activité"
        description="Voulez-vous vraiment supprimer l'activité ?"
        onContinue={() => {
          deleteActivityMutation.mutate({ param: { id: props.activityId } });
        }}
        onContinueLoading={deleteActivityMutation.isPending}
        onCancel={() => {
          confirmationModal.onClose();
        }}
      />
    </>
  );
};
