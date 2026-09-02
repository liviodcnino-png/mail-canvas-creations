import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";

export const Route = createFileRoute("/arquivados")({
  head: () => ({
    meta: [
      { title: "Arquivados — BOCA MAIL" },
      { name: "description", content: "Mensagens arquivadas fora da caixa de entrada, mas sempre pesquisáveis." },
      { property: "og:title", content: "Arquivados — BOCA MAIL" },
      { property: "og:description", content: "Mensagens arquivadas e sempre pesquisáveis." },
    ],
  }),
  component: () => (
    <MailboxView
      mailbox="archived"
      title="Arquivados"
      description="Fora da caixa de entrada, mas preservadas e pesquisáveis"
      emptyTitle="Nenhuma mensagem arquivada"
      emptyDescription="Arquive mensagens para limpar a caixa de entrada sem excluí-las."
    />
  ),
});
