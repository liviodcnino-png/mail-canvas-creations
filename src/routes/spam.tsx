import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MailboxView } from "@/components/mail/mailbox-view";
import { useConfirm } from "@/components/common/confirm-dialog";

export const Route = createFileRoute("/spam")({
  head: () => ({
    meta: [
      { title: "Spam — BOCA MAIL" },
      { name: "description", content: "Mensagens suspeitas isoladas automaticamente pelo filtro do BOCA MAIL." },
      { property: "og:title", content: "Spam — BOCA MAIL" },
      { property: "og:description", content: "Mensagens suspeitas isoladas pelo filtro anti-spam." },
    ],
  }),
  component: SpamPage,
});

function SpamPage() {
  const { confirm, dialog } = useConfirm();
  return (
    <>
      <MailboxView
        mailbox="spam"
        title="Spam"
        description="Mensagens isoladas pelo filtro anti-spam"
        emptyTitle="Sem spam"
        emptyDescription="Nenhuma mensagem suspeita foi identificada."
        banner={
          <div
            className="flex flex-wrap items-center gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
            role="alert"
          >
            <ShieldAlert className="size-4 text-destructive" aria-hidden />
            <span>
              Cuidado: mensagens aqui podem conter golpes ou links maliciosos. Nunca informe senhas ou dados bancários.
            </span>
          </div>
        }
        extraActions={
          <Button
            variant="outline"
            onClick={() =>
              confirm({
                title: "Bloquear remetentes selecionados?",
                description: "Mensagens futuras destes remetentes irão direto para o spam. Ação demonstrativa.",
                confirmLabel: "Bloquear",
                destructive: true,
                onConfirm: () => toast.success("Remetentes bloqueados"),
              })
            }
          >
            Bloquear remetentes
          </Button>
        }
      />
      {dialog}
    </>
  );
}
