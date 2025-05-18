"use client";
import { Button } from "@/components/ui/button";
import {
  MrsModal,
  MrsModalContent,
  MrsModalHeader,
  MrsModalTitle,
} from "@/components/mrs/MrsModal";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { ModalProps } from "@/hooks/useModale";

interface BzConfirmationModalProps extends ModalProps {
  onCancel?: () => void;
  onContinue: () => void;
  onContinueLoading: boolean;
  continueLabel?: string;
  title: string;
  description: string;
}

export const MrsConfirmationModal = ({
  onContinue,
  onCancel,
  onContinueLoading,
  continueLabel = "Continuer",
  title,
  description,
  ...props
}: BzConfirmationModalProps) => {
  const handleCancel = () => {
    onCancel?.();
    props.onClose();
  };
  return (
    <MrsModal {...props}>
      <MrsModalContent className="!max-w-sm">
        <MrsModalHeader>
          <MrsModalTitle>{title}</MrsModalTitle>
        </MrsModalHeader>
        <div className="flex flex-col p-5 gap-5 ">
          <p className="text-muted-foreground">{description}</p>
          <div className="w-full flex flex-row items-center justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => onContinue()}
              disabled={onContinueLoading}
            >
              {onContinueLoading && (
                <Spinner weight="bold" className="animate-spin" />
              )}
              {continueLabel}
            </Button>
          </div>
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
