import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Plus, Search, Star, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, ListSkeleton } from "@/components/common/states";
import { useConfirm } from "@/components/common/confirm-dialog";
import { useMail } from "@/lib/mail/store";
import { avatarTone, formatFullDate, initials } from "@/lib/mail/format";
import type { Contact } from "@/lib/mail/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contatos")({
  head: () => ({
    meta: [
      { title: "Contatos — BOCA MAIL" },
      { name: "description", content: "Agenda de contatos com histórico de mensagens, informações e notas." },
      { property: "og:title", content: "Contatos — BOCA MAIL" },
      { property: "og:description", content: "Agenda com histórico, informações e notas por contato." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const { contacts, loading, addContact, emails, openComposer } = useMail();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState<Contact | null>(null);
  const [newOpen, setNewOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", company: "", role: "" });
  const { confirm, dialog } = useConfirm();

  const filtered = contacts.filter((c) =>
    [c.name, c.email, c.company].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Contatos</h1>
          <p className="text-sm text-muted-foreground">{contacts.length} contatos na sua agenda</p>
        </div>
        <div className="ml-auto flex flex-1 items-center gap-2 sm:flex-none">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar contato"
              aria-label="Buscar contato"
              className="pl-9"
            />
          </div>
          <Button onClick={() => setNewOpen(true)}>
            <UserPlus className="size-4" aria-hidden /> Novo contato
          </Button>
        </div>
      </div>

      {loading ? (
        <ListSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum contato encontrado"
          description="Ajuste a busca ou cadastre um novo contato na sua agenda."
          icon={UserPlus}
          action={<Button onClick={() => setNewOpen(true)}>Novo contato</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setActive(c)}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    avatarTone(c.email),
                  )}
                  aria-hidden
                >
                  {initials(c.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                    {c.name}
                    {c.favorite && <Star className="size-3.5 fill-warning text-warning" aria-label="Favorito" />}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.role} · {c.company}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-base font-semibold",
                      avatarTone(active.email),
                    )}
                    aria-hidden
                  >
                    {initials(active.name)}
                  </span>
                  <span className="flex flex-col">
                    {active.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {active.role} · {active.company}
                    </span>
                  </span>
                </SheetTitle>
                <SheetDescription>Detalhes do contato e histórico de mensagens.</SheetDescription>
              </SheetHeader>

              <div className="flex flex-wrap gap-2 px-4">
                <Button size="sm" onClick={() => openComposer({ to: active.email })}>
                  <Mail className="size-4" aria-hidden /> Enviar e-mail
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Ligação simulada")}>
                  <Phone className="size-4" aria-hidden /> Ligar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() =>
                    confirm({
                      title: `Excluir ${active.name}?`,
                      description: "O contato será removido da sua agenda. Ação demonstrativa.",
                      confirmLabel: "Excluir contato",
                      destructive: true,
                      onConfirm: () => {
                        setActive(null);
                        toast.success("Contato excluído");
                      },
                    })
                  }
                >
                  <Trash2 className="size-4" aria-hidden /> Excluir
                </Button>
              </div>

              <Tabs defaultValue="historico" className="px-4 pb-6">
                <TabsList className="w-full">
                  <TabsTrigger value="historico" className="flex-1">Histórico</TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
                  <TabsTrigger value="notas" className="flex-1">Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="historico" className="space-y-2 pt-3">
                  {emails.slice(0, 6).map((e) => (
                    <div key={e.id} className="boca-surface rounded-lg p-3">
                      <p className="truncate text-sm font-medium">{e.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">{e.preview}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{formatFullDate(e.date)}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="info" className="space-y-3 pt-3 text-sm">
                  <Info label="E-mail" value={active.email} />
                  <Info label="Telefone" value={active.phone} />
                  <Info label="Empresa" value={active.company} />
                  <Info label="Cargo" value={active.role} />
                  <Info label="Último contato" value={formatFullDate(active.lastContact)} />
                </TabsContent>

                <TabsContent value="notas" className="space-y-3 pt-3">
                  <Textarea defaultValue={active.notes} className="min-h-32" aria-label="Notas do contato" />
                  <Button size="sm" onClick={() => toast.success("Notas salvas")}>
                    Salvar notas
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo contato</DialogTitle>
            <DialogDescription>Cadastre um contato na agenda do BOCA MAIL.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["name", "Nome completo"],
                ["email", "E-mail"],
                ["phone", "Telefone"],
                ["company", "Empresa"],
                ["role", "Cargo"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={cn("space-y-1.5", key === "name" && "sm:col-span-2")}>
                <Label htmlFor={`nc-${key}`}>{label}</Label>
                <Input
                  id={`nc-${key}`}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.name.trim() || !form.email.trim()}
              onClick={() => {
                addContact({
                  ...form,
                  tags: ["Novo"],
                  favorite: false,
                  notes: "Sem observações registradas.",
                  lastContact: new Date().toISOString(),
                });
                setForm({ name: "", email: "", phone: "", company: "", role: "" });
                setNewOpen(false);
              }}
            >
              <Plus className="size-4" aria-hidden /> Adicionar contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
