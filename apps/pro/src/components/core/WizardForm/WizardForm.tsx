import { createContext, useState, ReactNode, useContext, useMemo } from "react";
import { WizardFormStepProvider } from "./WizardFormStepContext";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon, CheckIcon, XIcon } from "lucide-react";
import { z } from "zod";

/**
 * Représente une étape du wizard.
 */
export interface WizardStep {
  title: string;
  component: ReactNode; // Composant de l'étape
}
type StepStatus = "current" | "success" | "error" | "warning" | "inactive";
/**
 * Données partagées par toutes les étapes :
 * - currentStep : index de l'étape courante
 * - nextStep, prevStep : navigation
 * - stepsData : l'ensemble des datas par étape
 */
interface WizardFormContextProps<
  T extends z.ZodType<unknown, z.ZodTypeDef, unknown>,
> {
  currentStep: number;
  maxStep: number;
  nextStep: () => void;
  prevStep: () => void;
  stepsData: Record<number, unknown>;
  stepsStatus: StepStatus[];
  setStepStatus: (status: StepStatus, index: number) => void;
  onSubmit: (data: z.infer<T>) => void;
  isLoading?: boolean;
  isLastStep: boolean;
  handleStepSubmit: (stepIndex: number, data: Record<string, unknown>) => void;
  data: Record<string, unknown>;
}

/**
 * Contexte principal du wizard
 */
export const WizardFormContext = createContext<
  WizardFormContextProps<z.ZodType<unknown>>
>({
  currentStep: 0,
  maxStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  stepsData: {},
  stepsStatus: [],
  setStepStatus: () => {},
  onSubmit: () => {},
  isLoading: false,
  isLastStep: false,
  handleStepSubmit: () => {},
  data: {},
});

interface WizardFormProviderProps<
  T extends z.ZodType<unknown, z.ZodTypeDef, unknown>,
> {
  steps: WizardStep[];
  children?: ReactNode;
  className?: string;
  zodSchema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: z.infer<T>;
  isLoading?: boolean;
}

/**
 * WizardFormProvider :
 *   - Stocke l'index d'étape courant
 *   - Stocke un objet stepsData (mapping de stepIndex -> data)
 *
 *   - Rendu : affiche tous les steps, chacun enveloppé par un WizardFormStepProvider
 *     => Cela permet à chaque step d'avoir son propre 'index' en contexte.
 */
export const WizardForm = <
  T extends z.ZodType<unknown, z.ZodTypeDef, unknown>,
>({
  steps,
  children,
  className,
  onSubmit,
  isLoading,
}: WizardFormProviderProps<T>) => {
  const [stepsStatus, setStepsStatus] = useState<StepStatus[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);
  const [stepsData, setStepsData] = useState<
    Record<number, Record<string, unknown>>
  >({});

  const setStepStatus = (status: StepStatus, index: number) => {
    setStepsStatus((prev) => {
      const newStatus = [...prev];
      newStatus[index] = status;
      return newStatus;
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const newStep = prev < steps.length - 1 ? prev + 1 : prev;
      setMaxStep((v) => Math.max(v, newStep));
      setStepStatus("success", prev);
      return newStep;
    });
  };
  const mergeStepsData = () => {
    // Par exemple on fait un reduce pour tout fusionner
    return Object.values(stepsData).reduce((acc, stepObj) => {
      return { ...acc, ...stepObj };
    }, {});
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => mergeStepsData(), [stepsData]);

  const prevStep = () => {
    setCurrentStep((prev) => {
      const newStep = prev > 0 ? prev - 1 : prev;
      return newStep;
    });
  };

  const handleStepSubmit = (stepIndex: number, data: unknown) => {
    setStepsData((prev) => ({
      ...prev,
      [stepIndex]: data as Record<string, unknown>,
    }));
    nextStep();
    // 2) Vérifier si c'est la dernière étape
    const isLast = stepIndex === steps.length - 1;
    if (isLast) {
      // on appelle le onSubmit avec la data fusionnée
      onSubmit(mergeStepsData());
    }
  };
  const isLastStep = currentStep === steps.length - 1;
  return (
    <WizardFormContext.Provider
      value={{
        data,
        currentStep,
        nextStep,
        prevStep,
        stepsData,
        maxStep,
        stepsStatus,
        setStepStatus,
        onSubmit,
        isLoading,
        isLastStep,
        handleStepSubmit,
      }}
    >
      <div className={cn("flex flex-col gap-4 p-4", className)}>
        <div className="flex flex-row gap-2">
          {steps?.map((step, index) => {
            const stepStatus = stepsStatus?.[index] || "inactive";
            return (
              <div className="flex flex-1 flex-col gap-2" key={index}>
                <div className="flex flex-row gap-1 w-full items-center">
                  <div
                    className={cn(
                      "flex justify-center items-center rounded-full p-1",
                      currentStep === index &&
                        maxStep >= index &&
                        "bg-primary/40",
                      currentStep === index &&
                        stepStatus === "success" &&
                        "bg-green-500/40",
                      currentStep === index &&
                        stepStatus === "error" &&
                        "bg-red-500/40",
                      currentStep === index &&
                        stepStatus === "warning" &&
                        "bg-yellow-500/40"
                    )}
                  >
                    <div
                      className={cn(
                        "aspect-square rounded-full bg-success w-6 h-6 flex items-center justify-center bg-neutral-200",
                        maxStep >= index && "bg-primary",
                        currentStep === index &&
                          "bg-primary border-2 border-background ",
                        stepStatus === "success" && "bg-green-500",
                        stepStatus === "error" && "bg-red-500",
                        stepStatus === "warning" && "bg-yellow-500"
                      )}
                    >
                      {stepStatus === "success" && (
                        <CheckIcon className="size-4 text-white" />
                      )}
                      {stepStatus === "error" && (
                        <XIcon className="size-4 text-white" />
                      )}
                      {stepStatus === "warning" && (
                        <AlertTriangleIcon className="size-4 text-white" />
                      )}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex flex-1 w-full rounded-xl bg-neutral-200">
                      <div
                        className={cn(
                          "flex h-1 rounded-xl transition-all duration-300",
                          index === maxStep && "w-1/2 bg-primary",
                          index < maxStep && "w-full bg-primary",
                          index > maxStep && "w-0",
                          stepStatus === "success" && "bg-green-500",
                          stepStatus === "error" && "bg-red-500",
                          stepStatus === "warning" && "bg-yellow-500"
                        )}
                      />
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "flex flex-col",
                    currentStep === index ? "opacity-100" : "opacity-80"
                  )}
                >
                  <p className="text-xs line-clamp-1 text-muted-foreground">
                    Étape {index + 1}
                  </p>
                  <p
                    className={cn(
                      "text-sm line-clamp-1 text-foreground",
                      currentStep === index ? "font-medium" : "font-normal"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* On rend toutes les étapes, chacune enveloppée par un WizardFormStepProvider */}
        {steps.map((step, index) => (
          <WizardFormStepProvider index={index} key={index + step.title}>
            {step.component}
          </WizardFormStepProvider>
        ))}
      </div>
      {/* En cas de besoin, vous pouvez aussi rendre d'autres éléments (ex: un stepper) */}
      {children}
    </WizardFormContext.Provider>
  );
};
export const useWizardFormContext = <
  T extends z.ZodType<unknown, z.ZodTypeDef, unknown>,
>(): WizardFormContextProps<T> => {
  const context = useContext(WizardFormContext);
  if (!context) {
    throw new Error(
      "useWizardFormContext must be used within a WizardFormProvider"
    );
  }
  return context;
};
