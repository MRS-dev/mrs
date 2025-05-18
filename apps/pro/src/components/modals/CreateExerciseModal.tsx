"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModalProps } from "@/hooks/useModale";
import {
  MrsModal,
  MrsModalContent,
  MrsModalHeader,
  MrsModalTitle,
} from "../mrs/MrsModal";
import { useCreateExercise } from "@/queries/exercises/useCreateExercise";
import { z } from "zod";

export const createExerciseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit comporter au moins 3 caractères" }),
  description: z.string().min(10, {
    message: "La description doit comporter au moins 10 caractères",
  }),
});

type CreateExerciseFormInputs = z.infer<typeof createExerciseSchema>;

const CreateExerciseModal: React.FC<ModalProps> = (props) => {
  const createExercise = useCreateExercise();

  const form = useForm<CreateExerciseFormInputs>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (json: CreateExerciseFormInputs) => {
    createExercise.mutateAsync({ json });
    form.reset();
  };

  return (
    <MrsModal {...props}>
      <MrsModalContent className="w-full max-w-2xl flex flex-col">
        <MrsModalHeader>
          <MrsModalTitle className="text-foreground">
            Créer un Nouvel Exercice
          </MrsModalTitle>
        </MrsModalHeader>
        <div className="px-5 pb-5 flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <Input
                      {...field}
                      placeholder="Titre de l'exercice"
                      className="mt-1"
                    />
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...field}
                      placeholder="Description de l'exercice"
                      className="mt-1"
                    />
                    {error && <FormMessage>{error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              {/* Ajoutez plus de champs de formulaire si nécessaire */}
              <Button
                type="submit"
                disabled={createExercise.isPending}
                className="w-full"
              >
                {createExercise.isPending
                  ? "Création en cours..."
                  : "Créer l'Exercice"}
              </Button>
            </form>
          </Form>
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};

export default CreateExerciseModal;
