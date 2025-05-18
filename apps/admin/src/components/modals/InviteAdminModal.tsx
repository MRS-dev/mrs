import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModalProps } from "@/hooks/useModale";
import { useInviteAdmin } from "@/queries/admins/useInviteAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const createAdminSchema = z
  .object({
    email: z.string().email(),
    emailConfirmation: z.string().email(),
  })
  .refine((data) => data.email === data.emailConfirmation, {
    path: ["emailConfirmation"],
    message: "Les emails ne correspondent pas",
  });

type InviteAdminModalInputs = z.infer<typeof createAdminSchema>;

export const InviteAdminModal = (props: ModalProps) => {
  const form = useForm<InviteAdminModalInputs>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      emailConfirmation: "",
    },
  });

  const inviteAdminMutation = useInviteAdmin();

  useEffect(() => {
    form.reset();
  }, [props.open]);

  const onSubmit = (data: InviteAdminModalInputs) => {
    inviteAdminMutation.mutate(data);
  };
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un admin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <Alert className="bg-orange-100 border-orange-500 text-orange-900 rounded-xl">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Vous allez inviter un admin à rejoindre votre application.
            </AlertDescription>
          </Alert>
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
              name="emailConfirmation"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirmer l&apos;email</FormLabel>
                  <Input {...field} type="email" className="!mt-1" />
                  {fieldState.error?.message && (
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="secondary"
                size="lg"
                type="button"
                onClick={() => props.onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                size="lg"
                type="submit"
                disabled={inviteAdminMutation.isPending}
              >
                {inviteAdminMutation.isPending
                  ? "Invitation en cours..."
                  : "Inviter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
