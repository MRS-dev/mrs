"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";

function MrsModal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function MrsModalTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function MrsModalPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function MrsModalClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function MrsModalOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60",
        className
      )}
      {...props}
    />
  );
}

function MrsModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <MrsModalPortal data-slot="dialog-portal">
      <MrsModalOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "max-h-[80vh] rounded-xl bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {/* <DialogPrimitive.Close
          asChild
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-3 right-4 transition-opacity  focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none rounded-xl"
        >
          <Button size="icon" variant="light">
            <X />
            <span className="sr-only">Close</span>
          </Button>
        </DialogPrimitive.Close> */}
      </DialogPrimitive.Content>
    </MrsModalPortal>
  );
}

function MrsModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="flex flex-row items-center justify-between bg-background border-none rounded-t-xl top-0 sticky">
      <div
        data-slot="dialog-header"
        className={cn(
          "flex flex-col gap-2 text-center sm:text-left p-4",
          className
        )}
        {...props}
      />
      <DialogPrimitive.Close asChild>
        <Button variant="ghost" size="sm">
          <X className="size-5" />
        </Button>
      </DialogPrimitive.Close>
    </div>
  );
}

function MrsModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function MrsModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold text-left", className)}
      {...props}
    />
  );
}

function MrsModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  MrsModal,
  MrsModalClose,
  MrsModalContent,
  MrsModalDescription,
  MrsModalFooter,
  MrsModalHeader,
  MrsModalOverlay,
  MrsModalPortal,
  MrsModalTitle,
  MrsModalTrigger,
};
