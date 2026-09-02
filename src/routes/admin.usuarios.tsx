import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/admin-ui";
import { useConfirm } from "@/components/common/confirm-dialog";
import { adminUsers } from "@/lib/mail/data";
import { formatFullDate } from "@/lib/mail/format";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — BOCA MAIL Admin" },
      { name: "description", content: "Gestão de usuários, papéis, cotas e status de acesso no BOCA MAIL." },
      { property: "og:title", content: "Usuários — BOCA MAIL Admin" },
      { property: "og:description", content: "Gestão de usuários, papéis e cotas." },
    ],
  }),
  component: AdminUsers,
});

const statusVariant: Record<string, string> = {
  ativo: "border-success/40 bg-success/10 text-success",
  pendente: "border-warning/40 bg-warning/15 text-warning-foreground",
  suspenso: "border-destructive/40 bg-destructive/10 text-destructive",
};

function AdminUsers() {
  const [open, setOpen] = React.useState(false);
  const { confirm, dialog } = useConfirm();

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Usuários"
        description="Contas de pessoas com acesso à suite"
        actions={
          <Button onClick={() => setOpen(true)}>
            <UserPlus className="size-4" aria-hidden /> Criar conta
          </Button>
        }
      />

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusVariant[u.status]}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {u.usedGb} / {u.quotaGb} GB
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatFullDate(u.lastAccess)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Edição de usuário (demonstração)")}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        confirm({
                          title: `Excluir ${u.name}?`,
                          description: "O usuário perderá o acesso e a caixa será desativada. Ação demonstrativa.",
                          confirmLabel: "Excluir usuário",
                          destructive: true,
                          onConfirm: () => toast.success("Usuário excluído"),
                        })
                      }
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar conta de usuário</DialogTitle>
            <DialogDescription>Formulário visual, sem provisionamento real.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="u-name">Nome completo</Label>
              <Input id="u-name" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="u-email">E-mail</Label>
              <Input id="u-email" type="email" placeholder="nome@bocamail.com.br" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-role">Papel</Label>
              <Select defaultValue="usuario">
                <SelectTrigger id="u-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuário</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-quota">Cota</Label>
              <Select defaultValue="15">
                <SelectTrigger id="u-quota"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 GB</SelectItem>
                  <SelectItem value="15">15 GB</SelectItem>
                  <SelectItem value="25">25 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Conta criada (demonstração)");
              }}
            >
              Criar conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
