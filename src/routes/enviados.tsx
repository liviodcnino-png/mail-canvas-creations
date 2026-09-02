import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";

export const Route = createFileRoute("/enviados")({
  head: () => ({
    meta: [
      { title: "Enviados — BOCA MAIL" },
      { name: "description", content: "Acompanhe o status de entrega das mensagens enviadas pelo BOCA MAIL." },
      { property: "og:title", content: "Enviados — BOCA MAIL" },
      { property: "og:description", content: "Status Enviado, Entregue, Falha e Agendado das suas mensagens." },
    ],
  }),
  component: () => (
    <MailboxView
      mailbox="sent"
      title="Enviados"
      description="Status de entrega: enviado, entregue, falha ou agendado"
      showStatus
      emptyTitle="Nenhuma mensagem enviada"
      emptyDescription="As mensagens que você enviar aparecerão nesta lista."
    />
  ),
});
