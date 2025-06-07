import { ReactNode, useEffect } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { z } from "zod";
import { useWizardFormStepContext } from "./WizardFormStepContext";
import { cn } from "@/lib/utils";
import { useWizardFormContext } from "./WizardForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

/**
 * WizardFormStepProps
 *  - T : le type dérivé du schéma Zod, qui doit étendre 'FieldValues'
 */
interface WizardFormStepProps<T extends FieldValues> {
  zodSchema: z.ZodSchema<T>;
  /**
   * children : fonction qui reçoit l'objet 'form' (UseFormReturn<T>)
   *            et renvoie un composant React
   */
  children: (form: UseFormReturn<T>) => ReactNode;
  className?: string;
}

export const WizardFormStep = <T extends FieldValues>({
  children,
  zodSchema,
  className,
}: WizardFormStepProps<T>) => {
  const { index } = useWizardFormStepContext();
  const {
    currentStep,
    stepsData,
    handleStepSubmit,
    prevStep,
    setStepStatus,
    isLoading,
    isLastStep,
  } = useWizardFormContext();
  // On indique à useForm que le type est SchemaType (qui lui-même étend FieldValues)
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: stepsData[index] as DefaultValues<T>,
  });
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      setStepStatus("error", index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.errors]);

  //   const onSubmit = (data: z.infer<typeof zodSchema>) => {
  //     setStepData(index, data);
  //     nextStep();
  //   };
  const onSubmitLocal = (data: z.infer<typeof zodSchema>) => {
    handleStepSubmit(index, data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitLocal)}
        className={cn(
          "flex flex-col gap-4",
          index !== currentStep && "hidden",
          className
        )}
      >
        {/* On passe l'instance 'form' à children */}
        {children(form)}
        <div className="flex flex-row justify-end gap-4">
          {index > 0 && (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={prevStep}
              disabled={isLoading}
            >
              Précédent
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            variant="default"
            disabled={isLoading}
          >
            {isLoading && <LoaderCircle className="size-4 animate-spin" />}
            {isLastStep ? "Envoyer" : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
