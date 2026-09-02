import * as React from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const quick = [
  ["Hoje às 18:00", "Fim do expediente"],
  ["Amanhã às 08:00", "Início da manhã"],
  ["Amanhã às 13:00", "Após o almoço"],
  ["Segunda-feira às 09:00", "Começo da semana"],
];

export function ScheduleDialog({
  open,
  onOpenChange,
  onScheduled,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onScheduled?: (when: string) => void;
}) {
  const [date, setDate] = React.useState("2026-09-03");
  const [time, setTime] = React.useState("09:00");

  const schedule = (when: string) => {
    onOpenChange(false);
    onScheduled?.(when);
    toast.success("Envio agendado", { description: `${when} · America/São_Paulo (demonstração).` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-4" aria-hidden /> Agendar envio
          </DialogTitle>
          <DialogDescription>
            Horários no fuso America/São_Paulo (BRT). Nenhum envio real é efetuado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {quick.map(([label, hint]) => (
            <button
              key={label}
              type="button"
              onClick={() => schedule(label)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="sch-date">Data</Label>
            <Input id="sch-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sch-time">Hora</Label>
            <Input id="sch-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => schedule(`${date.split("-").reverse().join("/")} às ${time}`)}>
            Agendar envio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
