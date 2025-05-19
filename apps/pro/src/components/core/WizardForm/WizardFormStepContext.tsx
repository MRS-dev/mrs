import React, { createContext, ReactNode, useContext, useState } from "react";

interface WizardFormStepContextProps {
  index: number;
  setIndex: (newIndex: number) => void;
}

/**
 * Contexte pour un "Step" précis
 */
const WizardFormStepContext = createContext<
  WizardFormStepContextProps | undefined
>(undefined);

interface WizardFormStepProviderProps {
  children: ReactNode;
  index: number; // l'index de l'étape
}

/**
 * WizardFormStepProvider :
 *   - Permet d'exposer "index" (numéro d'étape) à l'arborescence
 *   - Le composant WizardFormStep va pouvoir s'en servir
 */
export const WizardFormStepProvider: React.FC<WizardFormStepProviderProps> = ({
  children,
  index,
}) => {
  // On stocke localement "index", si on veut l'updater.
  // Mais souvent on n'en a pas vraiment besoin de setIndex.
  // On peut laisser la nav globale au WizardFormContext.
  const [currentIndex, setCurrentIndex] = useState(index);

  return (
    <WizardFormStepContext.Provider
      value={{ index: currentIndex, setIndex: setCurrentIndex }}
    >
      {children}
    </WizardFormStepContext.Provider>
  );
};

export const useWizardFormStepContext = (): WizardFormStepContextProps => {
  const context = useContext(WizardFormStepContext);
  if (!context) {
    throw new Error(
      "useWizardFormStepContext must be used within a WizardFormStepProvider"
    );
  }
  return context;
};
