import * as React from "react";
import {
  Archive,
  ArchiveRestore,
  CheckCheck,
  Clock,
  Inbox,
  MailOpen,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/states";
import { useConfirm } from "@/components/common/confirm-dialog";
import { EmailView } from "./email-view";
import { useSearchQuery } from "@/components/layout/app-shell";
import { useMail } from "@/lib/mail/store";
import { avatarTone, formatListDate, initials } from "@/lib/mail/format";
import type { Email, EmailCategory, MailboxId } from "@/lib/mail/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  entregue: "bg-success/15 text-success border-success/30",
  enviado: "bg-info/15 text-info border-info/30",
  falha: "bg-destructive/15 text-destructive border-destructive/30",
  agendado: "bg-warning/20 text-warning-foreground border-warning/40",
};

export interface MailboxViewProps {
  mailbox: MailboxId;
  title: string;
  description?: string;
  showTabs?: boolean;
  showStatus?: boolean;
  banner?: React.ReactNode;
  extraActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  folderFilter?: string;
}

export function MailboxView({
  mailbox,
  title,
  description,
  showTabs,
  showStatus,
  banner,
  extraActions,
  emptyTitle = "Nada por aqui",
  emptyDescription = "Quando houver mensagens nesta pasta, elas aparecerão aqui.",
  folderFilter,
}: MailboxViewProps) {
  const { byMailbox, loading, error, reload, toggleStar, markRead, moveTo, removeForever } = useMail();
  const search = useSearchQuery().toLowerCase().trim();
  const [tab, setTab] = React.useState<EmailCategory | "todos">(showTabs ? "principal" : "todos");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState<Email | null>(null);
  const { confirm, dialog } = useConfirm();

  const all = byMailbox(mailbox);
  const emails = all.filter((e) => {
    if (folderFilter && e.folder?.toLowerCase() !== folderFilter.toLowerCase()) return false;
    if (tab !== "todos" && e.category !== tab) return false;
    if (!search) return true;
    return (
      e.subject.toLowerCase().includes(search) ||
      e.from.name.toLowerCase().includes(search) ||
      e.from.email.toLowerCase().includes(search) ||
      e.preview.toLowerCase().includes(search)
    );
  });

  const unread = all.filter((e) => !e.read).length;
  const allSelected = emails.length > 0 && selected.length === emails.length;

  const act = (fn: () => void) => {
    fn();
    setSelected([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            {title}
            {unread > 0 && (
              <Badge className="h-5 rounded-full px-2 text-[11px]">{unread} não lidas</Badge>
            )}
          </h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {extraActions}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Atualizar lista" onClick={reload}>
                <RefreshCw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Atualizar</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {banner}

      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-card/60 px-3 py-2">
        <Checkbox
          checked={allSelected}
          aria-label="Selecionar todas as mensagens"
          className="mx-2"
          onCheckedChange={(v) => setSelected(v ? emails.map((e) => e.id) : [])}
        />
        <ToolbarButton label="Marcar como lida" icon={MailOpen} disabled={!selected.length} onClick={() => act(() => { markRead(selected, true); toast.success("Marcadas como lidas"); })} />
        <ToolbarButton label="Arquivar" icon={Archive} disabled={!selected.length} onClick={() => act(() => moveTo(selected, "archived", "Mensagens arquivadas"))} />
        <ToolbarButton label="Marcar como spam" icon={ShieldAlert} disabled={!selected.length} onClick={() => act(() => moveTo(selected, "spam", "Movidas para spam"))} />
        <ToolbarButton
          label="Excluir"
          icon={Trash2}
          disabled={!selected.length}
          onClick={() =>
            confirm({
              title: `Excluir ${selected.length} mensagem(ns)?`,
              description:
                mailbox === "trash"
                  ? "Esta ação é permanente e não pode ser desfeita."
                  : "As mensagens serão movidas para a lixeira.",
              confirmLabel: "Excluir",
              destructive: true,
              onConfirm: () =>
                act(() =>
                  mailbox === "trash" ? removeForever(selected) : moveTo(selected, "trash", "Movidas para a lixeira"),
                ),
            })
          }
        />
        <ToolbarButton label="Adiar" icon={Clock} disabled={!selected.length} onClick={() => act(() => moveTo(selected, "snoozed", "Mensagens adiadas"))} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais ações da seleção" disabled={!selected.length}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => act(() => markRead(selected, false))}>
              <CheckCheck className="size-4" aria-hidden /> Marcar como não lida
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => act(() => toast.success("Marcador aplicado"))}>
              <Tag className="size-4" aria-hidden /> Aplicar marcador
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => act(() => moveTo(selected, "inbox", "Movidas para a caixa de entrada"))}>
              <ArchiveRestore className="size-4" aria-hidden /> Mover para caixa de entrada
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="ml-auto pr-2 text-xs text-muted-foreground">
          {selected.length ? `${selected.length} selecionada(s)` : `${emails.length} mensagem(ns)`}
        </span>
      </div>

      {showTabs && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as EmailCategory)} className="border-b border-border bg-card/60 px-3 py-2">
          <TabsList>
            <TabsTrigger value="principal">Principal</TabsTrigger>
            <TabsTrigger value="promocoes">Promoções</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="atualizacoes">Atualizações</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <ListSkeleton />
      ) : emails.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} icon={Inbox} />
      ) : (
        <ul className="divide-y divide-border">
          {emails.map((e) => (
            <li key={e.id}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/50 md:px-4",
                  !e.read && "bg-primary/[0.045]",
                  selected.includes(e.id) && "bg-accent",
                )}
              >
                <Checkbox
                  checked={selected.includes(e.id)}
                  aria-label={`Selecionar mensagem de ${e.from.name}`}
                  onCheckedChange={(v) =>
                    setSelected((prev) => (v ? [...prev, e.id] : prev.filter((id) => id !== e.id)))
                  }
                />
                <button
                  type="button"
                  aria-label={e.starred ? "Remover dos favoritos" : "Marcar como favorito"}
                  onClick={() => toggleStar(e.id)}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-warning"
                >
                  <Star className={cn("size-4", e.starred && "fill-warning text-warning")} />
                </button>
                <span
                  className={cn(
                    "hidden size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:flex",
                    avatarTone(e.from.email),
                  )}
                  aria-hidden
                >
                  {initials(e.from.name)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    markRead([e.id], true);
                    setOpen(e);
                  }}
                  className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("truncate text-sm", e.read ? "font-medium" : "font-bold")}>
                      {mailbox === "sent" || mailbox === "drafts" ? e.to[0]?.name : e.from.name}
                    </span>
                    {e.folder && (
                      <Badge variant="outline" className="hidden h-5 px-1.5 text-[10px] md:inline-flex">
                        {e.folder}
                      </Badge>
                    )}
                    {showStatus && e.status && (
                      <Badge variant="outline" className={cn("h-5 px-1.5 text-[10px] capitalize", statusStyles[e.status])}>
                        {e.status}
                      </Badge>
                    )}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className={cn("truncate text-sm", !e.read && "font-semibold")}>{e.subject}</span>
                    <span className="hidden truncate text-sm text-muted-foreground md:inline">— {e.preview}</span>
                  </span>
                </button>
                {e.attachments.length > 0 && (
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-label="Contém anexos" />
                )}
                <time className="w-16 shrink-0 text-right text-xs text-muted-foreground" dateTime={e.date}>
                  {formatListDate(e.date)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}

      <EmailView email={open} onClose={() => setOpen(null)} />
      {dialog}
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} disabled={disabled} onClick={onClick}>
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
