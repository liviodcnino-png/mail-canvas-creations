import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caixa de entrada — BOCA MAIL" },
      { name: "description", content: "Leia, organize e responda suas mensagens na caixa de entrada do BOCA MAIL." },
      { property: "og:title", content: "Caixa de entrada — BOCA MAIL" },
      { property: "og:description", content: "Leia, organize e responda suas mensagens no BOCA MAIL." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  return (
    <MailboxView
      mailbox="inbox"
      title="Caixa de entrada"
      description="Mensagens recebidas nas suas contas conectadas"
      showTabs
      emptyTitle="Sua caixa está vazia"
      emptyDescription="Nenhuma mensagem corresponde aos filtros aplicados nesta aba."
    />
  );
}
