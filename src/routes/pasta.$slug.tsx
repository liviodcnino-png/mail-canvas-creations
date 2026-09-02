import { createFileRoute } from "@tanstack/react-router";
import { MailboxView } from "@/components/mail/mailbox-view";
import { useMail } from "@/lib/mail/store";

export const Route = createFileRoute("/pasta/$slug")({
  head: () => ({
    meta: [
      { title: "Pasta — BOCA MAIL" },
      { name: "description", content: "Mensagens organizadas em pastas personalizadas do BOCA MAIL." },
      { property: "og:title", content: "Pasta — BOCA MAIL" },
      { property: "og:description", content: "Mensagens organizadas em pastas personalizadas." },
    ],
  }),
  component: FolderPage,
});

function FolderPage() {
  const { slug } = Route.useParams();
  const { folders } = useMail();
  const folder = folders.find((f) => f.slug === slug);
  const name = folder?.name ?? slug;

  return (
    <MailboxView
      mailbox="inbox"
      folderFilter={name}
      title={name}
      description="Pasta personalizada"
      emptyTitle="Pasta vazia"
      emptyDescription="Mova mensagens para esta pasta para organizá-las."
    />
  );
}
