import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";

export const Route = createFileRoute("/adiados")({
  head: () => ({
    meta: [
      { title: "Adiados — BOCA MAIL" },
      { name: "description", content: "Mensagens adiadas que retornarão à caixa de entrada no horário definido." },
      { property: "og:title", content: "Adiados — BOCA MAIL" },
      { property: "og:description", content: "Mensagens adiadas com retorno programado." },
    ],
  }),
  component: () => (
    <MailboxView
      mailbox="snoozed"
      title="Adiados"
      description="Voltam para a caixa de entrada no horário programado (America/São_Paulo)"
      emptyTitle="Nenhuma mensagem adiada"
      emptyDescription="Adie mensagens para tratá-las em outro momento."
    />
  ),
});
