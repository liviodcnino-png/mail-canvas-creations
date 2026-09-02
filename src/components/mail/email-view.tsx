import * as React from "react";
import {
  Archive,
  CornerUpLeft,
  Download,
  FileText,
  Forward,
  MoreHorizontal,
  Paperclip,
  Printer,
  ShieldAlert,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/components/common/confirm-dialog";
import { useMail } from "@/lib/mail/store";
import { avatarTone, formatFullDate, initials } from "@/lib/mail/format";
import type { Email } from "@/lib/mail/types";
import { cn } from "@/lib/utils";

export function EmailView({ email, onClose }: { email: Email | null; onClose: () => void }) {
  const { toggleStar, moveTo, openComposer } = useMail();
  const { confirm, dialog } = useConfirm();

  return (
    <>
      <Dialog open={!!email} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto p-0">
          {email && (
            <>
              <div className="space-y-3 border-b border-border p-5">
                <DialogTitle className="pr-8 text-lg font-semibold leading-snug">{email.subject}</DialogTitle>
                <DialogDescription className="sr-only">Visualização da mensagem</DialogDescription>
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      avatarTone(email.from.email),
                    )}
                    aria-hidden
                  >
                    {initials(email.from.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {email.from.name}{" "}
                      <span className="font-normal text-muted-foreground">&lt;{email.from.email}&gt;</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      para {email.to.map((t) => t.name).join(", ")}
                      {email.cc?.length ? ` · cc ${email.cc.map((c) => c.name).join(", ")}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatFullDate(email.date)}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={email.starred ? "Remover dos favoritos" : "Marcar como favorito"}
                      onClick={() => toggleStar(email.id)}
                    >
                      <Star className={cn("size-4", email.starred && "fill-warning text-warning")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Arquivar mensagem"
                      onClick={() => {
                        moveTo([email.id], "archived", "Mensagem arquivada");
                        onClose();
                      }}
                    >
                      <Archive className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir mensagem"
                      onClick={() =>
                        confirm({
                          title: "Excluir mensagem?",
                          description: "A mensagem será movida para a lixeira.",
                          confirmLabel: "Excluir",
                          destructive: true,
                          onConfirm: () => {
                            moveTo([email.id], "trash", "Mensagem movida para a lixeira");
                            onClose();
                          },
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Mais ações">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Marcado como não lida")}>
                          Marcar como não lida
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Impressão simulada")}>
                          <Printer className="size-4" aria-hidden /> Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            confirm({
                              title: `Bloquear ${email.from.name}?`,
                              description:
                                "Mensagens futuras deste remetente irão direto para o spam. Ação demonstrativa.",
                              confirmLabel: "Bloquear remetente",
                              destructive: true,
                              onConfirm: () => toast.success("Remetente bloqueado"),
                            })
                          }
                        >
                          <ShieldAlert className="size-4" aria-hidden /> Bloquear remetente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <article className="space-y-4 p-5 text-sm leading-relaxed">
                {email.body.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </article>

              {email.attachments.length > 0 && (
                <div className="px-5 pb-5">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Paperclip className="size-3.5" aria-hidden /> {email.attachments.length} anexo(s)
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {email.attachments.map((a) => (
                      <div key={a.id} className="boca-surface flex items-center gap-3 rounded-lg p-3">
                        <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="size-4" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.size}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Baixar ${a.name}`}
                          onClick={() => toast.info("Download simulado")}
                        >
                          <Download className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
              <div className="flex flex-wrap gap-2 p-4">
                <Button
                  onClick={() =>
                    openComposer({
                      mode: "responder",
                      to: email.from.email,
                      subject: `Re: ${email.subject}`,
                    })
                  }
                >
                  <CornerUpLeft className="size-4" aria-hidden /> Responder
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    openComposer({ mode: "encaminhar", subject: `Enc: ${email.subject}`, body: email.body.join("\n\n") })
                  }
                >
                  <Forward className="size-4" aria-hidden /> Encaminhar
                </Button>
                {email.status && <Badge variant="secondary" className="self-center">{email.status}</Badge>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {dialog}
    </>
  );
}
