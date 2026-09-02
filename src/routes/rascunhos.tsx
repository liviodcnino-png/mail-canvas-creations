import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MailboxView } from "@/components/mail/mailbox-view";
import { useMail } from "@/lib/mail/store";

export const Route = createFileRoute("/rascunhos")({
  head: () => ({
    meta: [
      { title: "Rascunhos — BOCA MAIL" },
      { name: "description", content: "Retome mensagens salvas automaticamente como rascunho no BOCA MAIL." },
      { property: "og:title", content: "Rascunhos — BOCA MAIL" },
      { property: "og:description", content: "Retome mensagens salvas automaticamente." },
    ],
  }),
  component: DraftsPage,
});

function DraftsPage() {
  const { openComposer } = useMail();
  return (
    <MailboxView
      mailbox="drafts"
      title="Rascunhos"
      description="Mensagens salvas automaticamente e ainda não enviadas"
      emptyTitle="Sem rascunhos"
      emptyDescription="Comece uma mensagem e ela será salva automaticamente aqui."
      extraActions={
        <Button onClick={() => openComposer()}>
          <Pencil className="size-4" aria-hidden /> Novo rascunho
        </Button>
      }
    />
  );
}
