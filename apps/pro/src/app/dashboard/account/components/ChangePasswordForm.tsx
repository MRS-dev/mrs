"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import InputPassword from "@/components/mrs/MrsInputPassword";
import { useChangePassword } from "@/queries/auth/useChangePassword";
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });
type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm: React.FC = () => {
  const form = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePassword = useChangePassword();
  const onSubmit = (data: ChangePasswordFormInputs) => {
    console.log(data);
    changePassword.mutate(data);
    // Logique pour changer le mot de passe
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          name="currentPassword"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Mot de passe actuel</FormLabel>
              <InputPassword {...field} type="password" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Nouveau mot de passe</FormLabel>
              <InputPassword {...field} type="password" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
              <InputPassword {...field} type="password" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            className="my-4"
            variant="default"
            size="lg"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending
              ? "Changement en cours..."
              : "Changer le mot de passe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
