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
import { useSignIn } from "@/queries/auth/useSignIn";
import InputPassword from "@/components/mrs/MrsInputPassword";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { queryKeys } from "@/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useSignIn({
    onSuccess: () => {
      router.push(ROUTES.mfaVerify);
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
    },
  });
  const onSubmit = (data: LoginFormInputs) => {
    console.log("LOGON", data);
    signInMutation.mutate(data);
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
            <Button type="submit" className="w-full my-4" size="lg">
              Se connecter
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
