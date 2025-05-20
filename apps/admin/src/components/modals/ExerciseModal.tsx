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
import { ModalProps } from "@/hooks/useModale";
import { useCreateExercise } from "@/queries/exercises/useCreateExercise";
import { queryKeys } from "@/queries/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MrsModal, MrsModalContent, MrsModalTitle } from "../mrs/MrsModal";
import MrsFileUploadArea from "../mrs/MrsFileUpload";

const createExerciseSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  photo: z.any().optional(), // Fichier image
  video: z.any().optional(), // Fichier vidéo
});

export type CreateExerciseFormInputs = z.infer<typeof createExerciseSchema>;

export const CreateExerciseModal = (props: ModalProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateExerciseFormInputs>({
    resolver: zodResolver(createExerciseSchema),
  });

  const createExerciseMutation = useCreateExercise({
    onSuccess: () => {
      // toast({
      //   title: "Exercice créé avec succès",
      //   description: "L'exercice a été créé avec succès",
      //   variant: "success",
      // });

      form.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.exercises() });
      props.onClose();
    },
  });
  const onSubmit = async (json: CreateExerciseFormInputs) => {
    // const formData = new FormData();

    // Ajout des données
    // formData.append("title", data.title);
    // formData.append("description", data.description);
    // if (data.photo?.[0]) formData.append("photo", data.photo[0]);
    // if (data.video?.[0]) formData.append("video", data.video[0]);

    createExerciseMutation.mutate({ json });
  };

  return (
    <MrsModal {...props}>
      <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[90vh] overflow-auto">
        <div className="flex flex-row items-center justify-between gap-4 px-4 py-2 sticky top-0 bg-background/70 backdrop-blur-sm border-b z-10">
          <MrsModalTitle>Créer un exercice</MrsModalTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => props.onOpenChange(false)}
          >
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
              <FormField
                control={form.control}
                name="photo"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <MrsFileUploadArea
                      {...field}
                      accept="image/*"
                      onChange={(files) => field.onChange(files)}
                    />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="video"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Vidéo</FormLabel>
                    <MrsFileUploadArea
                      {...field}
                      accept="video/*"
                      onChange={(files) => field.onChange(files)}
                    />
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
                type="submit"
                disabled={createExerciseMutation.status === "pending"}
              >
                {createExerciseMutation.status === "pending" ? (
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
  );
};
