import { createFileRoute } from "@tanstack/react-router";
import { Mail, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard, PageHeader } from "@/components/admin/admin-ui";
import { useConfirm } from "@/components/common/confirm-dialog";
import { adminUsers } from "@/lib/mail/data";

export const Route = createFileRoute("/admin/contas")({
  head: () => ({
    meta: [
      { title: "Contas — BOCA MAIL Admin" },
      { name: "description", content: "Todas as caixas de e-mail provisionadas, com cota e domínio." },
      { property: "og:title", content: "Contas — BOCA MAIL Admin" },
      { property: "og:description", content: "Caixas provisionadas, cotas e domínios." },
    ],
  }),
  component: AdminAccounts,
});

function AdminAccounts() {
  const { confirm, dialog } = useConfirm();

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Contas"
        description="Caixas de e-mail provisionadas na organização"
        actions={
          <Button onClick={() => toast.info("Provisionamento simulado")}>
            <Plus className="size-4" aria-hidden /> Nova caixa
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Caixas ativas" value="85" hint="4 domínios" icon={Mail} />
        <MetricCard label="Cota média" value="17 GB" hint="por caixa" icon={Mail} />
        <MetricCard label="Acima de 80% da cota" value="6" hint="Requerem atenção" icon={Mail} />
      </div>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caixa</TableHead>
                <TableHead>Domínio</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email.split("@")[1]}</TableCell>
                  <TableCell className="w-48">
                    <Progress value={(u.usedGb / u.quotaGb) * 100} aria-label={`Uso de ${u.email}`} />
                    <span className="text-xs text-muted-foreground">
                      {u.usedGb} / {u.quotaGb} GB
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        confirm({
                          title: `Excluir a conta ${u.email}?`,
                          description: "A caixa e todo o seu conteúdo seriam removidos. Ação demonstrativa.",
                          confirmLabel: "Excluir conta",
                          destructive: true,
                          onConfirm: () => toast.success("Conta excluída"),
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
      {dialog}
    </div>
  );
}
