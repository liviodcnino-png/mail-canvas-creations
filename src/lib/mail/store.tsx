import * as React from "react";
import { toast } from "sonner";
import { mailAccounts, seedContacts, seedEmails, seedFolders, ME_USER } from "./data";
import type { Contact, Email, MailFolder, MailboxId } from "./types";

/**
 * Camada de dados mockada. Todas as leituras passam por este store,
 * de forma que a troca por uma API real exija apenas substituir os
 * métodos abaixo por chamadas de rede.
 */

export interface ComposerState {
  open: boolean;
  mode: "novo" | "responder" | "encaminhar";
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

const emptyComposer: ComposerState = {
  open: false,
  mode: "novo",
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  body: "",
};

interface MailContextValue {
  emails: Email[];
  contacts: Contact[];
  folders: MailFolder[];
  accounts: typeof mailAccounts;
  me: typeof ME_USER;
  loading: boolean;
  offline: boolean;
  error: boolean;
  reload: () => void;
  simulateError: () => void;
  toggleOffline: () => void;
  byMailbox: (m: MailboxId) => Email[];
  counts: Record<MailboxId, number>;
  toggleStar: (id: string) => void;
  markRead: (ids: string[], read: boolean) => void;
  moveTo: (ids: string[], mailbox: MailboxId, label?: string) => void;
  removeForever: (ids: string[]) => void;
  emptyTrash: () => void;
  addFolder: (name: string) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  composer: ComposerState;
  openComposer: (patch?: Partial<ComposerState>) => void;
  closeComposer: () => void;
  setComposer: React.Dispatch<React.SetStateAction<ComposerState>>;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const MailContext = React.createContext<MailContextValue | null>(null);

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = React.useState<Email[]>(seedEmails);
  const [contacts, setContacts] = React.useState<Contact[]>(seedContacts);
  const [folders, setFolders] = React.useState<MailFolder[]>(seedFolders);
  const [loading, setLoading] = React.useState(true);
  const [offline, setOffline] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [composer, setComposer] = React.useState<ComposerState>(emptyComposer);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const reload = React.useCallback(() => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  }, []);

  const value: MailContextValue = {
    emails,
    contacts,
    folders,
    accounts: mailAccounts,
    me: ME_USER,
    loading,
    offline,
    error,
    reload,
    simulateError: () => setError(true),
    toggleOffline: () => setOffline((o) => !o),
    byMailbox: (m) =>
      emails
        .filter((e) => (m === "starred" ? e.starred && e.mailbox !== "trash" : e.mailbox === m))
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    counts: (["inbox", "starred", "snoozed", "sent", "drafts", "archived", "spam", "trash"] as MailboxId[]).reduce(
      (acc, m) => {
        acc[m] =
          m === "starred"
            ? emails.filter((e) => e.starred && e.mailbox !== "trash").length
            : m === "inbox"
              ? emails.filter((e) => e.mailbox === "inbox" && !e.read).length
              : emails.filter((e) => e.mailbox === m).length;
        return acc;
      },
      {} as Record<MailboxId, number>,
    ),
    toggleStar: (id) =>
      setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))),
    markRead: (ids, read) =>
      setEmails((prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, read } : e))),
    moveTo: (ids, mailbox, label) => {
      setEmails((prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, mailbox } : e)));
      toast.success(label ?? `${ids.length} mensagem(ns) movida(s)`, {
        description: "Ação demonstrativa — nenhum servidor foi contatado.",
      });
    },
    removeForever: (ids) => {
      setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
      toast.success(`${ids.length} mensagem(ns) excluída(s) definitivamente`);
    },
    emptyTrash: () => {
      setEmails((prev) => prev.filter((e) => e.mailbox !== "trash"));
      toast.success("Lixeira esvaziada");
    },
    addFolder: (name) => {
      setFolders((prev) => [...prev, { slug: slugify(name), name, count: 0 }]);
      toast.success(`Pasta "${name}" criada`);
    },
    addContact: (c) => {
      setContacts((prev) => [{ ...c, id: `c-${Date.now()}` }, ...prev]);
      toast.success(`Contato ${c.name} adicionado`);
    },
    composer,
    openComposer: (patch) => setComposer({ ...emptyComposer, ...patch, open: true }),
    closeComposer: () => setComposer(emptyComposer),
    setComposer,
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useMail() {
  const ctx = React.useContext(MailContext);
  if (!ctx) throw new Error("useMail deve ser usado dentro de MailProvider");
  return ctx;
}
