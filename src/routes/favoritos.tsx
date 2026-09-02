import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — BOCA MAIL" },
      { name: "description", content: "Mensagens marcadas com estrela para acesso rápido no BOCA MAIL." },
      { property: "og:title", content: "Favoritos — BOCA MAIL" },
      { property: "og:description", content: "Mensagens marcadas com estrela para acesso rápido." },
    ],
  }),
  component: () => (
    <MailboxView
      mailbox="starred"
      title="Favoritos"
      description="Mensagens marcadas com estrela"
      emptyTitle="Nenhum favorito"
      emptyDescription="Marque mensagens com a estrela para encontrá-las aqui."
    />
  ),
});
