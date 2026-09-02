import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/states";
import { PageHeader } from "@/components/admin/admin-ui";
import { adminLogs } from "@/lib/mail/data";
import { formatFullDate } from "@/lib/mail/format";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({
    meta: [
      { title: "Logs — BOCA MAIL Admin" },
      { name: "description", content: "Registro de eventos de acesso, entrega e configuração da suite." },
      { property: "og:title", content: "Logs — BOCA MAIL Admin" },
      { property: "og:description", content: "Eventos de acesso, entrega e configuração." },
    ],
  }),
  component: AdminLogs,
});

const tone: Record<string, string> = {
  info: "border-info/40 bg-info/10 text-info",
  aviso: "border-warning/40 bg-warning/15 text-warning-foreground",
  erro: "border-destructive/40 bg-destructive/10 text-destructive",
};

function AdminLogs() {
  const [level, setLevel] = React.useState("todos");
  const [q, setQ] = React.useState("");

  const rows = adminLogs.filter(
    (l) =>
      (level === "todos" || l.level === level) &&
      [l.action, l.actor, l.ip].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Logs" description="Auditoria de eventos do sistema" />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-full space-y-1.5 sm:w-64">
          <Label htmlFor="log-q">Buscar</Label>
          <Input id="log-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ação, usuário ou IP" />
        </div>
        <div className="w-full space-y-1.5 sm:w-48">
          <Label htmlFor="log-level">Nível</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger id="log-level"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="aviso">Aviso</SelectItem>
              <SelectItem value="erro">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          {rows.length === 0 ? (
            <EmptyState title="Nenhum log encontrado" description="Ajuste os filtros para ver outros eventos." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nível</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Badge variant="outline" className={tone[l.level]}>{l.level}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{l.action}</TableCell>
                    <TableCell className="text-muted-foreground">{l.actor}</TableCell>
                    <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                    <TableCell className="text-muted-foreground">{formatFullDate(l.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
