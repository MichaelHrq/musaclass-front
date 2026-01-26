import {
  Dialog as Dialog_,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

type PropsType = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function Dialog({
  children,
  subtitle,
  title,
  open,
  onClose,
  className,
}: PropsType) {
  return (
    <Dialog_ open={open} onOpenChange={onClose}>
      <DialogContent className={className}>
        {(title || subtitle) && (
          <DialogHeader>
            <DialogTitle className="text-start">{title}</DialogTitle>
            <DialogDescription className="text-start">
              {subtitle}
            </DialogDescription>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog_>
  );
}
