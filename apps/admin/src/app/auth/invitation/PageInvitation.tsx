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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputPassword from "@/components/mrs/MrsInputPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/routes";
import { useAcceptInvitation } from "@/queries/invitations/useAcceptInvitation";
const acceptInvitationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

type AcceptInvitationFormInputs = z.infer<typeof acceptInvitationSchema>;

const InvitationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const form = useForm<AcceptInvitationFormInputs>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });
  const acceptInvitationMutation = useAcceptInvitation({
    onSuccess: () => {
      router.push(ROUTES.login);
    },
  });
  const onSubmit = (data: AcceptInvitationFormInputs) => {
    console.log("data", data, token);
    acceptInvitationMutation.mutate({ json: { ...data, token: token! } });
  };
  return (
    <div className="flex  w-full flex-col items-center">
      <div className="h-60 max-h-[25vh] bg-primary/20 w-full"></div>
      <div className="w-full max-w-lg rounded-xl border p-10 shadow-sm relative z-10 bg-background -mt-20">
        <h1 className="text-4xl font-extrabold mb-4">Se connecter</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
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
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <InputPassword {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between">
                    <FormLabel>Confirm Password</FormLabel>
                  </div>
                  <InputPassword {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full my-4" size="lg">
              Se connecter
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvitationPage;
