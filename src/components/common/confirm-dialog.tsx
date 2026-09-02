import * as React from "react";
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
import { cn } from "@/lib/utils";

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  options,
  onOpenChange,
}: {
  options: ConfirmOptions | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={!!options} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          <AlertDialogDescription>{options?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(options?.destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
            onClick={() => options?.onConfirm()}
          >
            {options?.confirmLabel ?? "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirm() {
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);
  const confirm = React.useCallback((o: ConfirmOptions) => setOptions(o), []);
  const dialog = (
    <ConfirmDialog options={options} onOpenChange={(open) => !open && setOptions(null)} />
  );
  return { confirm, dialog };
}
