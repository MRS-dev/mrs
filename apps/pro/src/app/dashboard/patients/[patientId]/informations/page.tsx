"use client";
import React, { useEffect } from "react";
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
import { useParams } from "next/navigation";
import { usePatient } from "@/queries/patients/usePatient";
import { MrsBirthdayPicker } from "@/components/mrs/BirthdayPicker";

interface PatientData {
  lastName: string;
  firstName: string;
  birthDate: string;
  email: string;
  phoneNumber?: string;
  socialSecurityNumber?: string;
  allergies?: string;
}

const PatientInformationsSchema = z.object({
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  birthDate: z.date(),
  email: z.string().email({ message: "L'email est invalide" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Le numéro de téléphone est requis" }),
  socialSecurityNumber: z
    .string()
    .min(1, { message: "Le numéro de sécurité sociale est requis" }),
  allergies: z.string().min(1, { message: "Les allergies sont requises" }),
});
type PatientInformationsFormInputs = z.infer<typeof PatientInformationsSchema>;

const PatientProgram: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const patientQuery = usePatient(patientId);
  const patient = patientQuery.data;

  const form = useForm<PatientInformationsFormInputs>({
    resolver: zodResolver(PatientInformationsSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: new Date(),
      email: "",
      phoneNumber: "",
      socialSecurityNumber: "",
      allergies: "",
    },
  });
  useEffect(() => {
    if (patient && typeof patient === 'object' && 'lastName' in patient) {
      const patientData = patient as PatientData;
      form.reset({
        lastName: patientData.lastName,
        firstName: patientData.firstName,
        birthDate: new Date(patientData.birthDate),
        email: patientData.email,
        phoneNumber: patientData.phoneNumber || "",
        socialSecurityNumber: patientData.socialSecurityNumber || "",
        allergies: patientData.allergies || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient]);

  // const updatePatientMutation = useUpdatePatient(patientId);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
      <Form {...form}>
        <div>
          <h3 className="text-xl font-semibold text-foreground  pb-2">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
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
          </div>
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field, fieldState }) => (
              <FormItem className="max-w-72 mb-4">
                <FormLabel>Date de naissance</FormLabel>
                <MrsBirthdayPicker {...field} className="!mt-1" />
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
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <Input {...field} type="email" className="!mt-1" />
                {fieldState.error?.message && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="phoneNumber2"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone 2</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            /> */}
          </div>
          <FormField
            control={form.control}
            name="socialSecurityNumber"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel>Numéro de sécurité sociale</FormLabel>
                <Input {...field} className="!mt-1" />
                {fieldState.error?.message && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allergies"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel>Allergies</FormLabel>
                <Input {...field} className="!mt-1" />
                {fieldState.error?.message && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default PatientProgram;
