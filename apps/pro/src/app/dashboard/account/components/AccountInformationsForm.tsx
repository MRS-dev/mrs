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
import { useUser } from "@/queries/user/useUser";

const accountInformationsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
});
type AccountInformationFormInputs = z.infer<typeof accountInformationsSchema>;
const AccountInformationForm: React.FC = () => {
  const user = useUser();
  const form = useForm<AccountInformationFormInputs>({
    resolver: zodResolver(accountInformationsSchema),
    defaultValues: {
      name: user?.data?.data?.user.name,
      email: user?.data?.data?.user.email,
    },
  });
  const onSubmit = (data: AccountInformationFormInputs) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-4">
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-96">
              <FormLabel>Nom</FormLabel>
              <Input {...field} type="text" className="!mt-1" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Email</FormLabel>
              <Input {...field} type="email" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Téléphone</FormLabel>
              <Input {...field} type="tel" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="address"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Adresse</FormLabel>
              <Input {...field} type="text" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="city"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Ville</FormLabel>
              <Input {...field} type="text" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="postalCode"
          render={({ field, fieldState }) => (
            <FormItem className="max-w-96">
              <FormLabel>Code Postal</FormLabel>
              <Input {...field} type="text" className="!mt-1" />
              {fieldState.error?.message && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="my-4" variant="default" size="lg">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountInformationForm;
