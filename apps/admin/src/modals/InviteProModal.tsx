import {
  MrsModal,
  MrsModalContent,
  MrsModalHeader,
  MrsModalTitle,
} from "@/components/mrs/MrsModal";
import { Input } from "@/components/ui/input";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useInvitePro } from "@/queries/pros/useInvitePro";
import { ModalProps } from "@/hooks/useModale";
import { Button } from "@/components/ui/button";

const inviteProSchema = z
  .object({
    firstName: z.string().min(1, { message: "Le prénom est requis." }),
    lastName: z.string().min(1, { message: "Le nom est requis." }),
    email: z.string().email({ message: "L'email est invalide." }),
    emailConfirmation: z.string().email({ message: "L'email est invalide." }),
  })
  .refine((data) => data.email === data.emailConfirmation, {
    message: "Les emails ne correspondent pas.",
    path: ["emailConfirmation"],
  });

type InviteProFormInputs = z.infer<typeof inviteProSchema>;

export const InviteProModal = (props: ModalProps) => {
  console.log("INVITE PRO MODAL", props);
  const form = useForm<InviteProFormInputs>({
    resolver: zodResolver(inviteProSchema),
  });
  const inviteProMutation = useInvitePro({
    onSuccess: () => {
      form.reset();
      props.onClose();
    },
  });

  const onSubmit = (json: InviteProFormInputs) => {
    inviteProMutation.mutate({ json });
  };

  return (
    <MrsModal {...props}>
      <MrsModalContent>
        <MrsModalHeader>
          <MrsModalTitle>Inviter un kiné</MrsModalTitle>
        </MrsModalHeader>
        <div className="p-5 flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid gap-4"
            >
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
                name="emailConfirmation"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirmation d&apos;email</FormLabel>
                    <Input {...field} type="email" className="!mt-1" />
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
                    <Input {...field} type="text" className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
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
                    <Input {...field} type="text" className="!mt-1" />
                    {fieldState.error?.message && (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Inviter
              </Button>
            </form>
          </Form>
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
