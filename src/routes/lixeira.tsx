import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MailboxView } from "@/components/mail/mailbox-view";
import { useConfirm } from "@/components/common/confirm-dialog";
import { useMail } from "@/lib/mail/store";

export const Route = createFileRoute("/lixeira")({
  head: () => ({
    meta: [
      { title: "Lixeira — BOCA MAIL" },
      { name: "description", content: "Mensagens excluídas ficam 30 dias na lixeira antes da remoção definitiva." },
      { property: "og:title", content: "Lixeira — BOCA MAIL" },
      { property: "og:description", content: "Mensagens excluídas com remoção definitiva controlada." },
    ],
  }),
  component: TrashPage,
});

function TrashPage() {
  const { emptyTrash } = useMail();
  const { confirm, dialog } = useConfirm();
  return (
    <>
      <MailboxView
        mailbox="trash"
        title="Lixeira"
        description="Itens são removidos definitivamente após 30 dias"
        emptyTitle="Lixeira vazia"
        emptyDescription="Nada aqui. Mensagens excluídas aparecerão nesta pasta."
        extraActions={
          <Button
            variant="destructive"
            onClick={() =>
              confirm({
                title: "Esvaziar a lixeira?",
                description: "Todas as mensagens da lixeira serão excluídas permanentemente. Esta ação é irreversível.",
                confirmLabel: "Esvaziar lixeira",
                destructive: true,
                onConfirm: emptyTrash,
              })
            }
          >
            <Trash2 className="size-4" aria-hidden /> Esvaziar lixeira
          </Button>
        }
      />
      {dialog}
    </>
  );
}
