"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MrsFileUploadArea from "@/components/mrs/MrsFileUpload";
import { useCreateRegistrationRequest } from "@/queries/registrationRequest/useCreateRegisrtationRequest";
import Image from "next/image";

const registrationRequestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  companyName: z.string().min(1, "Le nom de la société est requis"),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le numéro SIRET doit contenir exactement 14 chiffres"),
  rpps: z
    .string()
    .regex(/^\d{11}$/, "Le numéro RPPS doit contenir exactement 11 chiffres"),
  cni: z.any(),
  healthCard: z.any(),
});
type RegistrationRequestFormInputs = z.infer<typeof registrationRequestSchema>;

const RegistrationRequest: React.FC = () => {
  const [registrationRequestSent, setRegistrationRequestSent] = useState(false);
  // const { toast } = useToast();
  const createRegistrationRequest = useCreateRegistrationRequest({
    onSuccess: () => {
      setRegistrationRequestSent(true);
    },
  });

  const form = useForm<RegistrationRequestFormInputs>({
    resolver: zodResolver(registrationRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      siret: "",
      rpps: "",
      phoneNumber: "",
      companyName: "",
    },
  });

  const onSubmit = async (form: RegistrationRequestFormInputs) => {
    console.log("JE TENTE");
    createRegistrationRequest.mutate({
      form,
    });
  };

  return (
    <div className="flex w-full flex-col items-center bg-primary/20 min-h-screen">
      <div className="w-full p-4">
        <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-between">
          <Link
            href="/"
            className={cn("h-10 w-full flex items-center justify-center")}
          >
            <div className="w-12 h-10 min-w-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="logo"
                className="w-10 h-10 min-w-10"
                width={40}
                height={40}
              />
            </div>
            <div className="max-w-flex flex-1 transition-all duration-300 text-foreground font-bold text-base">
              <span className="text-lg truncate">Ma Routine Santé</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full max-w-lg rounded-xl border p-10 shadow-sm bg-background mt-10 mb-20">
        <h1 className="text-3xl font-extrabold mb-4">
          Demande d&apos;inscription pour les professionnels de la santé
        </h1>
        {registrationRequestSent ? (
          <p className="text-base text-muted-foreground">
            Votre demande a été envoyée avec succès. Vous recevrez un email de
            confirmation sous peu.
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {/* Champs du formulaire */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <Input {...field} />
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <Input {...field} />
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              {/* Autres champs */}

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <Input {...field} type="tel" className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nom de la société</FormLabel>
                    <Input {...field} className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siret"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>SIRET</FormLabel>
                    <Input {...field} className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rpps"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>N°RPPS</FormLabel>
                    <Input {...field} className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cni"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Carte nationale d&apos;identité</FormLabel>
                    <MrsFileUploadArea
                      accept="image/*"
                      multiple={true}
                      maxFiles={3} // Nombre maximum de fichiers
                      maxFileSizeMB={5} // Taille maximale : 5MB
                      onChange={(files) => {
                        field.onChange(files);
                      }} // Relie les fichiers à react-hook-form
                    />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="healthCard"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex flex-row items-center justify-between">
                      <FormLabel>Carte professionelle de santé</FormLabel>
                    </div>
                    <MrsFileUploadArea
                      accept="image/*"
                      multiple={true}
                      maxFiles={3} // Nombre maximum de fichiers
                      maxFileSizeMB={5} // Taille maximale : 5MB
                      onChange={(files) => field.onChange(files)} // Relie les fichiers à react-hook-form
                    />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Soumettre ma demande
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default RegistrationRequest;
