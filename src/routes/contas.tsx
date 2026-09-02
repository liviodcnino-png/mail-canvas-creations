import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, Plus, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfirm } from "@/components/common/confirm-dialog";
import { useMail } from "@/lib/mail/store";

export const Route = createFileRoute("/contas")({
  head: () => ({
    meta: [
      { title: "Contas de e-mail — BOCA MAIL" },
      { name: "description", content: "Gerencie as contas de e-mail conectadas à sua suite BOCA MAIL." },
      { property: "og:title", content: "Contas de e-mail — BOCA MAIL" },
      { property: "og:description", content: "Contas conectadas, cotas e adição de novas caixas." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const { accounts } = useMail();
  const [open, setOpen] = React.useState(false);
  const { confirm, dialog } = useConfirm();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Contas de e-mail</h1>
          <p className="text-sm text-muted-foreground">
            Interface demonstrativa — nenhuma conexão real de SMTP, IMAP ou POP3 é realizada.
          </p>
        </div>
        <Button className="ml-auto" onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden /> Adicionar conta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="boca-gradient flex size-10 items-center justify-center rounded-xl text-primary-foreground">
                  <Mail className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {a.name}
                    {a.primary && <Badge className="h-5 px-1.5 text-[10px]">Principal</Badge>}
                  </CardTitle>
                  <CardDescription className="truncate">{a.email}</CardDescription>
                </div>
                <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                  <CheckCircle2 className="size-3" aria-hidden /> {a.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Armazenamento</span>
                  <span>
                    {a.usedGb} GB de {a.quotaGb} GB
                  </span>
                </div>
                <Progress value={(a.usedGb / a.quotaGb) * 100} aria-label={`Uso da conta ${a.name}`} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Configurações da conta (demonstração)")}>
                  <Settings2 className="size-4" aria-hidden /> Configurar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() =>
                    confirm({
                      title: `Remover a conta ${a.email}?`,
                      description: "A conta será desconectada da suite. Ação demonstrativa.",
                      confirmLabel: "Remover conta",
                      destructive: true,
                      onConfirm: () => toast.success("Conta removida"),
                    })
                  }
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar conta de e-mail</DialogTitle>
            <DialogDescription>
              Formulário visual. Nenhuma credencial é enviada e nenhuma conexão é estabelecida.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ac-name">Nome de exibição</Label>
              <Input id="ac-name" placeholder="Ex.: Boca Projetos" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ac-email">Endereço de e-mail</Label>
              <Input id="ac-email" type="email" placeholder="nome@bocamail.com.br" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ac-type">Tipo de conta</Label>
              <Select defaultValue="boca">
                <SelectTrigger id="ac-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boca">BOCA MAIL</SelectItem>
                  <SelectItem value="outra">Outro provedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ac-quota">Cota</Label>
              <Select defaultValue="15">
                <SelectTrigger id="ac-quota"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 GB</SelectItem>
                  <SelectItem value="15">15 GB</SelectItem>
                  <SelectItem value="25">25 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Conta adicionada (demonstração)");
              }}
            >
              Adicionar conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {dialog}
    </div>
  );
}
