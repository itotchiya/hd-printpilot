"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileX, Save } from "lucide-react";

interface LeaveQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  isSaving?: boolean;
}

export function LeaveQuoteDialog({
  open,
  onOpenChange,
  onDiscard,
  onSaveAsDraft,
  isSaving = false,
}: LeaveQuoteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Quitter sans terminer ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Vous avez un devis en cours. Que souhaitez-vous faire ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <AlertDialogCancel
            onClick={onDiscard}
            className="flex items-center gap-2 order-2 sm:order-1"
          >
            <FileX className="h-4 w-4" />
            Abandonner
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSaveAsDraft}
            disabled={isSaving}
            className="flex items-center gap-2 order-1 sm:order-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder le brouillon"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
