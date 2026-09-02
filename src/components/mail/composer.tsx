import * as React from "react";
import {
  Bold,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Save,
  Send,
  Trash2,
  Underline,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useConfirm } from "@/components/common/confirm-dialog";
import { ScheduleDialog } from "./schedule-dialog";
import { useMail } from "@/lib/mail/store";

const tools = [
  [Bold, "Negrito"],
  [Italic, "Itálico"],
  [Underline, "Sublinhado"],
  [List, "Lista com marcadores"],
  [ListOrdered, "Lista numerada"],
  [Quote, "Citação"],
  [Link2, "Inserir link"],
  [ImageIcon, "Inserir imagem"],
] as const;

const demoAttachments = [
  { name: "pauta-editorial.pdf", size: "820 KB" },
  { name: "midia-kit-boca.pdf", size: "3,2 MB" },
];

export function Composer() {
  const { composer, setComposer, closeComposer } = useMail();
  const [showCc, setShowCc] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState<{ name: string; size: string }[]>([]);
  const { confirm, dialog } = useConfirm();

  React.useEffect(() => {
    if (composer.open) setAttachments([]);
  }, [composer.open]);

  const discard = () =>
    confirm({
      title: "Descartar mensagem?",
      description: "O conteúdo desta mensagem será perdido e não poderá ser recuperado.",
      confirmLabel: "Descartar",
      destructive: true,
      onConfirm: () => {
        closeComposer();
        toast.success("Mensagem descartada");
      },
    });

  const title =
    composer.mode === "responder" ? "Responder" : composer.mode === "encaminhar" ? "Encaminhar" : "Nova mensagem";

  return (
    <>
      <Dialog open={composer.open} onOpenChange={(o) => !o && closeComposer()}>
        <DialogContent
          showCloseButton={false}
          className="top-auto bottom-0 left-1/2 max-h-[92vh] w-full max-w-full translate-y-0 gap-0 overflow-hidden rounded-b-none p-0 sm:top-1/2 sm:max-w-2xl sm:-translate-y-1/2 sm:rounded-xl lg:max-w-3xl"
        >
          <div className="boca-gradient flex items-center justify-between px-4 py-3 text-primary-foreground">
            <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-primary-foreground hover:bg-white/15"
              aria-label="Fechar compositor"
              onClick={closeComposer}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="max-h-[calc(92vh-8rem)] overflow-y-auto">
            <div className="space-y-2 px-4 pt-4">
              <Row label="Para" id="cmp-to">
                <Input
                  id="cmp-to"
                  value={composer.to}
                  onChange={(e) => setComposer((c) => ({ ...c, to: e.target.value }))}
                  placeholder="destinatario@dominio.com"
                  className="border-0 px-0 shadow-none focus-visible:ring-0"
                />
                <Button variant="ghost" size="sm" className="shrink-0" onClick={() => setShowCc((s) => !s)}>
                  Cc/Cco
                </Button>
              </Row>
              {showCc && (
                <>
                  <Row label="Cc" id="cmp-cc">
                    <Input
                      id="cmp-cc"
                      value={composer.cc}
                      onChange={(e) => setComposer((c) => ({ ...c, cc: e.target.value }))}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                  </Row>
                  <Row label="Cco" id="cmp-bcc">
                    <Input
                      id="cmp-bcc"
                      value={composer.bcc}
                      onChange={(e) => setComposer((c) => ({ ...c, bcc: e.target.value }))}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                  </Row>
                </>
              )}
              <Row label="Assunto" id="cmp-subject">
                <Input
                  id="cmp-subject"
                  value={composer.subject}
                  onChange={(e) => setComposer((c) => ({ ...c, subject: e.target.value }))}
                  className="border-0 px-0 font-medium shadow-none focus-visible:ring-0"
                />
              </Row>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-0.5 border-y border-border bg-muted/40 px-3 py-1.5">
              {tools.map(([Icon, label]) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={label}
                      onClick={() => toast.info(`${label} — formatação demonstrativa`)}
                    >
                      <Icon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAttachments((a) => [...a, demoAttachments[a.length % demoAttachments.length]])}
              >
                <Paperclip className="size-4" aria-hidden /> Anexar
              </Button>
            </div>

            <Textarea
              value={composer.body}
              onChange={(e) => setComposer((c) => ({ ...c, body: e.target.value }))}
              placeholder="Escreva sua mensagem..."
              aria-label="Corpo da mensagem"
              className="min-h-56 resize-none rounded-none border-0 px-4 py-4 text-sm shadow-none focus-visible:ring-0"
            />

            {attachments.length > 0 && (
              <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
                {attachments.map((a, i) => (
                  <div
                    key={`${a.name}-${i}`}
                    className="boca-surface flex items-center gap-3 rounded-lg px-3 py-2.5"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.size}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Remover anexo ${a.name}`}
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-card px-4 py-3">
            <Button
              className="boca-gradient text-primary-foreground"
              onClick={() => {
                closeComposer();
                toast.success("Mensagem enviada", { description: "Simulação visual — nada foi transmitido." });
              }}
            >
              <Send className="size-4" aria-hidden /> Enviar
            </Button>
            <Button variant="outline" onClick={() => setScheduleOpen(true)}>
              <CalendarClock className="size-4" aria-hidden /> Agendar
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                closeComposer();
                toast.success("Rascunho salvo");
              }}
            >
              <Save className="size-4" aria-hidden /> Salvar rascunho
            </Button>
            <Button variant="ghost" className="ml-auto text-destructive" onClick={discard} aria-label="Descartar mensagem">
              <Trash2 className="size-4" aria-hidden /> Descartar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} onScheduled={() => closeComposer()} />
      {dialog}
    </>
  );
}

function Row({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-1">
      <Label htmlFor={id} className="w-16 shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
