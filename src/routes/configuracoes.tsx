import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMail } from "@/lib/mail/store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — BOCA MAIL" },
      { name: "description", content: "Ajuste geral, conta, aparência, inbox, assinatura, notificações e filtros." },
      { property: "og:title", content: "Configurações — BOCA MAIL" },
      { property: "og:description", content: "Personalize a sua experiência no BOCA MAIL." },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function ToggleRow({ label, hint, defaultChecked }: { label: string; hint: string; defaultChecked?: boolean }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

function SettingsPage() {
  const { me, theme, toggleTheme } = useMail();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Personalize o BOCA MAIL de acordo com o seu fluxo de trabalho</p>
      </div>

      <Tabs defaultValue="geral" className="gap-5">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="filtros">Filtros e regras</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Section title="Preferências gerais" description="Idioma, fuso horário e comportamento padrão.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lang">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="lang"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tz">Fuso horário</Label>
                <Select defaultValue="sp">
                  <SelectTrigger id="tz"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">America/São_Paulo (BRT)</SelectItem>
                    <SelectItem value="mao">America/Manaus</SelectItem>
                    <SelectItem value="lis">Europe/Lisbon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <ToggleRow label="Confirmar antes de excluir" hint="Exibe uma confirmação para ações destrutivas." defaultChecked />
            <ToggleRow label="Desfazer envio" hint="Mantém a mensagem por 10 segundos antes de enviar." defaultChecked />
            <Button onClick={() => toast.success("Preferências salvas")}>Salvar alterações</Button>
          </Section>
        </TabsContent>

        <TabsContent value="conta">
          <Section title="Dados da conta" description="Informações do usuário conectado.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="acc-name">Nome de exibição</Label>
                <Input id="acc-name" defaultValue={me.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-email">E-mail principal</Label>
                <Input id="acc-email" defaultValue={me.email} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-reply">Responder para</Label>
                <Input id="acc-reply" defaultValue="redacao@bocamail.com.br" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-phone">Telefone de recuperação</Label>
                <Input id="acc-phone" defaultValue="+55 11 98888-1010" />
              </div>
            </div>
            <Separator />
            <ToggleRow label="Verificação em duas etapas" hint="Camada extra de segurança no login." defaultChecked />
            <Button onClick={() => toast.success("Dados da conta atualizados")}>Salvar conta</Button>
          </Section>
        </TabsContent>

        <TabsContent value="aparencia">
          <Section title="Aparência" description="Tema, densidade e tamanho de fonte da interface.">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Tema</Label>
                <p className="text-xs text-muted-foreground">Atualmente em modo {theme === "dark" ? "escuro" : "claro"}.</p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                Alternar tema
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Densidade da lista</Label>
              <RadioGroup defaultValue="confortavel" className="flex flex-wrap gap-4">
                {[["compacta", "Compacta"], ["confortavel", "Confortável"], ["espacosa", "Espaçosa"]].map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`dens-${v}`} />
                    <Label htmlFor={`dens-${v}`}>{l}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-size">Tamanho da fonte</Label>
              <Slider id="font-size" defaultValue={[16]} min={12} max={22} step={1} className="max-w-sm" />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="inbox">
          <Section title="Caixa de entrada" description="Como as mensagens são agrupadas e exibidas.">
            <div className="space-y-1.5">
              <Label htmlFor="inbox-type">Tipo de caixa</Label>
              <Select defaultValue="categorias">
                <SelectTrigger id="inbox-type" className="max-w-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="categorias">Com categorias</SelectItem>
                  <SelectItem value="prioritaria">Prioritária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ToggleRow label="Agrupar por conversa" hint="Reúne respostas no mesmo tópico." defaultChecked />
            <ToggleRow label="Exibir prévia da mensagem" hint="Mostra o início do texto na lista." defaultChecked />
            <ToggleRow label="Painel de leitura" hint="Abre mensagens ao lado da lista em telas grandes." />
            <div className="space-y-2">
              <Label htmlFor="per-page">Mensagens por página</Label>
              <Slider id="per-page" defaultValue={[50]} min={10} max={100} step={10} className="max-w-sm" />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="assinatura">
          <Section title="Assinatura" description="Adicionada automaticamente às novas mensagens.">
            <Textarea
              aria-label="Assinatura"
              className="min-h-40 font-mono text-sm"
              defaultValue={`${me.name}\nEditor · BOCA MAIL\nredacao@bocamail.com.br | +55 11 98888-1010`}
            />
            <ToggleRow label="Inserir em respostas" hint="Também adiciona a assinatura ao responder." defaultChecked />
            <Button onClick={() => toast.success("Assinatura salva")}>Salvar assinatura</Button>
          </Section>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Section title="Notificações" description="Escolha o que deseja ser avisado.">
            <ToggleRow label="Notificações no navegador" hint="Alerta ao chegar nova mensagem." defaultChecked />
            <ToggleRow label="Somente mensagens importantes" hint="Reduz o volume de alertas." />
            <ToggleRow label="Som ao receber" hint="Toca um som discreto." defaultChecked />
            <ToggleRow label="Resumo diário por e-mail" hint="Enviado às 8h no horário de Brasília." />
          </Section>
        </TabsContent>

        <TabsContent value="filtros">
          <Section title="Filtros e regras" description="Automatize a organização das mensagens recebidas.">
            <div className="space-y-2">
              {[
                ["De: nexuspay.com.br", "Mover para Financeiro e marcar como importante"],
                ["Assunto contém “pauta”", "Aplicar marcador Editorial"],
                ["Anexos maiores que 10 MB", "Mover para Projetos"],
              ].map(([cond, action]) => (
                <div key={cond} className="boca-surface flex flex-wrap items-center gap-2 rounded-lg p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{cond}</p>
                    <p className="truncate text-xs text-muted-foreground">{action}</p>
                  </div>
                  <Badge variant="secondary">Ativa</Badge>
                  <Button variant="ghost" size="sm" onClick={() => toast.info("Editor de regra (demonstração)")}>
                    Editar
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={() => toast.success("Nova regra criada")}>Criar nova regra</Button>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
