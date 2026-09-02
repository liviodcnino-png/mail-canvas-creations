export type MailboxId =
  | "inbox"
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "archived"
  | "spam"
  | "trash";

export type EmailCategory = "principal" | "promocoes" | "social" | "atualizacoes";

export type SentStatus = "enviado" | "entregue" | "falha" | "agendado";

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "sheet" | "doc" | "zip";
}

export interface Person {
  name: string;
  email: string;
}

export interface Email {
  id: string;
  mailbox: MailboxId;
  category: EmailCategory;
  from: Person;
  to: Person[];
  cc?: Person[];
  subject: string;
  preview: string;
  body: string[];
  date: string; // ISO
  read: boolean;
  starred: boolean;
  important: boolean;
  attachments: Attachment[];
  folder?: string;
  status?: SentStatus;
  scheduledFor?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  tags: string[];
  favorite: boolean;
  notes: string;
  lastContact: string;
}

export interface MailFolder {
  slug: string;
  name: string;
  count: number;
}
