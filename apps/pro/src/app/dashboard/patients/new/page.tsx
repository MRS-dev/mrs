"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { WizardForm } from "@/components/core/WizardForm/WizardForm";
import { WizardFormStep } from "@/components/core/WizardForm/WizardFormStep";
import { MrsBirthdayPicker } from "@/components/mrs/BirthdayPicker";
import { useCreatePatient } from "@/queries/patients/useCreatePatient";

const phoneNumberSchema = z.string().refine(
  (val) => {
    const phoneNumber = parsePhoneNumberFromString(val, "FR"); // Remplacez 'FR' par le code pays approprié
    return phoneNumber ? phoneNumber.isValid() : false;
  },
  {
    message: "Numéro de téléphone invalide",
  }
);

const PersonalInfoSchema = z.object({
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom doit contenir au plus 50 caractères"),
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom doit contenir au plus 50 caractères"),
  birthDate: z.date(),
  email: z.string().email("Email invalide"),
  phoneNumber: phoneNumberSchema.optional(),
  phoneNumber2: phoneNumberSchema.optional(),
  socialSecurityNumber: z
    .string()
    .min(
      10,
      "Le numéro de sécurité sociale doit contenir au moins 10 caractères"
    ),
  allergies: z.string().optional(),
});

const AddressSchema = z.object({
  address: z.object({
    street: z.string().min(2, "La rue doit contenir au moins 2 caractères"),
    complement: z.string().optional(),
    city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    postalCode: z
      .string()
      .min(5, "Le code postal doit contenir au moins 5 caractères"),
    country: z.string().min(2, "Le pays doit contenir au moins 2 caractères"),
  }),
});

const EmergencyContactSchema = z.object({
  emergencyContact: z
    .object({
      firstName: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .optional(),
      lastName: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .optional(),
      phoneNumber: phoneNumberSchema.optional(),
      phoneNumber2: phoneNumberSchema.optional(),
      email: z.string().email("Email invalide").optional(),
    })
    .optional(),
});
const createPatientSchema = PersonalInfoSchema.merge(AddressSchema).merge(
  EmergencyContactSchema
);

export type CreatePatientSchema = z.infer<typeof createPatientSchema>;

const PersonalInfoStep = () => {
  return (
    <WizardFormStep zodSchema={PersonalInfoSchema}>
      {(form) => (
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
            <FormField
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
            />
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
      )}
    </WizardFormStep>
  );
};

const AddressStep = () => {
  return (
    <WizardFormStep zodSchema={AddressSchema}>
      {(form) => (
        <div>
          <h3 className="text-xl font-semibold text-foreground pb-2">
            Adresse
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <FormField
              control={form.control}
              name="address.street"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Rue</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.postalCode"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Code postal</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.country"
              render={({ field, fieldState }) => (
                <FormItem className="max-w-72">
                  <FormLabel>Pays</FormLabel>
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
            name="address.complement"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel>Complément d&apos;adresse</FormLabel>
                <Input {...field} className="!mt-1" />
                {fieldState.error?.message && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      )}
    </WizardFormStep>
  );
};

const EmergencyContactStep = () => {
  return (
    <WizardFormStep zodSchema={EmergencyContactSchema}>
      {(form) => (
        <div>
          <h3 className="text-xl font-semibold text-foreground pb-2">
            Contact en cas d&apos;urgence
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="emergencyContact.firstName"
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
              name="emergencyContact.lastName"
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="emergencyContact.phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem className="max-w-72">
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <Input {...field} className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact.phoneNumber2"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone 2</FormLabel>
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
            name="emergencyContact.email"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <Input {...field} className="!mt-1" />
                {fieldState.error?.message && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      )}
    </WizardFormStep>
  );
};

const NewPatient: React.FC = () => {
  const createPatient = useCreatePatient();
  const onSubmit = (json: CreatePatientSchema) => {
    console.log("JSON---->", json);
    createPatient.mutate({
      json,
    });
  };
  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">Nouveau patient</h1>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <WizardForm
        className="max-w-xl w-full mx-auto mt-10 rounded-xl"
        zodSchema={createPatientSchema}
        onSubmit={onSubmit}
        defaultValues={{
          lastName: "",
          firstName: "",
          birthDate: new Date(),
          email: "",
          phoneNumber: "",
          address: {
            street: "",
            city: "",
            postalCode: "",
            country: "",
            complement: "",
          },
          socialSecurityNumber: "",
          allergies: "",
          emergencyContact: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
          },
        }}
        steps={[
          {
            title: "Informations personnelles",
            component: <PersonalInfoStep />,
          },
          {
            title: "Adresse",
            component: <AddressStep />,
          },
          {
            title: "Contact en cas d'urgence",
            component: <EmergencyContactStep />,
          },
        ]}
        isLoading={createPatient.isPending}
      />
    </SidebarLayout>
  );
};

export default NewPatient;
