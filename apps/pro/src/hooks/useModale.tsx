import { useState } from "react";

export interface UseModalParams {
  defaultOpen?: boolean;
}
export const useModal = (params?: UseModalParams) => {
  const [open, setOpen] = useState(params?.defaultOpen);
  const onClose = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
  };
  return {
    open,
    onClose,
    onOpen,
    onOpenChange: (value: boolean) => setOpen(value),
  };
};

export type ModalProps = ReturnType<typeof useModal>;
