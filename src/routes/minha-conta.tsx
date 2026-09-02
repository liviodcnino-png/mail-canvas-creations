import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/components/common/confirm-dialog";
import { useMail } from "@/lib/mail/store";
import { avatarTone, initials } from "@/lib/mail/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — BOCA MAIL" },
      { name: "description", content: "Perfil, segurança e uso de armazenamento da sua conta BOCA MAIL." },
      { property: "og:title", content: "Minha conta — BOCA MAIL" },
      { property: "og:description", content: "Perfil, segurança e armazenamento da sua conta." },
    ],
  }),
  component: MyAccountPage,
});

function MyAccountPage() {
  const { me } = useMail();
  const { confirm, dialog } = useConfirm();

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-5 text-xl font-bold tracking-tight">Minha conta</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
            <CardDescription>Informações exibidas aos seus destinatários.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex size-16 items-center justify-center rounded-full text-xl font-semibold",
                  avatarTone(me.email),
                )}
                aria-hidden
              >
                {initials(me.name)}
              </span>
              <div>
                <p className="font-semibold">{me.name}</p>
                <p className="text-sm text-muted-foreground">{me.email}</p>
                <Badge variant="secondary" className="mt-1">Plano Profissional</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Nome</Label>
                <Input id="p-name" defaultValue={me.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-role">Cargo</Label>
                <Input id="p-role" defaultValue="Editor-chefe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-pass">Nova senha</Label>
                <Input id="p-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-pass2">Confirmar senha</Label>
                <Input id="p-pass2" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast.success("Perfil atualizado")}>Salvar alterações</Button>
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() =>
                  confirm({
                    title: "Excluir sua conta?",
                    description:
                      "Todos os dados, mensagens e contatos seriam removidos permanentemente. Ação demonstrativa.",
                    confirmLabel: "Excluir conta",
                    destructive: true,
                    onConfirm: () => toast.success("Solicitação de exclusão registrada"),
                  })
                }
              >
                Excluir conta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Armazenamento</CardTitle>
            <CardDescription>8,5 GB de 15 GB utilizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={57} aria-label="Uso de armazenamento" />
            {[
              ["Anexos", "4,2 GB"],
              ["Mensagens", "2,6 GB"],
              ["Lixeira", "1,7 GB"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => toast.info("Upgrade simulado")}>
              Ampliar armazenamento
            </Button>
          </CardContent>
        </Card>
      </div>
      {dialog}
    </div>
  );
}
