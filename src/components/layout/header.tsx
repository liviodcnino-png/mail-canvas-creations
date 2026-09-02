import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  CircleHelp,
  LogOut,
  Menu,
  Moon,
  Paperclip,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  UserCircle,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarNav } from "./sidebar-nav";
import { useMail } from "@/lib/mail/store";
import { avatarTone, initials } from "@/lib/mail/format";

export function Header({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const { me, theme, toggleTheme, offline, toggleOffline } = useMail();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [advOpen, setAdvOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-card/85 px-3 backdrop-blur md:px-5">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu de navegação">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[290px] p-0">
          <SheetTitle className="sr-only">Menu BOCA MAIL</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative flex max-w-2xl flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Pesquisar em todas as mensagens"
          aria-label="Pesquisar mensagens"
          className="h-11 rounded-xl bg-muted/60 pl-9 pr-11"
        />
        <Popover open={advOpen} onOpenChange={setAdvOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 size-9"
              aria-label="Abrir busca avançada"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[min(92vw,26rem)] space-y-3">
            <p className="text-sm font-semibold">Busca avançada</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="adv-from" label="De (remetente)" placeholder="nome@dominio.com" />
              <Field id="adv-to" label="Para (destinatário)" placeholder="nome@dominio.com" />
            </div>
            <Field id="adv-subject" label="Assunto" placeholder="Ex.: contrato" />
            <Field id="adv-words" label="Contém as palavras" placeholder="Ex.: proposta, prazo" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="adv-date" label="Data" type="date" />
              <div className="space-y-1.5">
                <Label htmlFor="adv-size">Tamanho maior que</Label>
                <Select defaultValue="qualquer">
                  <SelectTrigger id="adv-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualquer">Qualquer tamanho</SelectItem>
                    <SelectItem value="1">1 MB</SelectItem>
                    <SelectItem value="5">5 MB</SelectItem>
                    <SelectItem value="10">10 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adv-folder">Pasta</Label>
              <Select defaultValue="todas">
                <SelectTrigger id="adv-folder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as pastas</SelectItem>
                  <SelectItem value="inbox">Caixa de entrada</SelectItem>
                  <SelectItem value="enviados">Enviados</SelectItem>
                  <SelectItem value="arquivados">Arquivados</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox id="adv-att" /> <Paperclip className="size-3.5" aria-hidden /> Somente com anexos
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setAdvOpen(false)}>
                Limpar
              </Button>
              <Button
                onClick={() => {
                  setAdvOpen(false);
                  toast.success("Filtros aplicados", { description: "Busca demonstrativa com dados mockados." });
                }}
              >
                Buscar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <IconAction label="Ajuda" onClick={() => toast.info("Central de ajuda BOCA MAIL", { description: "Conteúdo demonstrativo." })}>
          <CircleHelp className="size-5" />
        </IconAction>

        <IconAction label={offline ? "Voltar a ficar online" : "Simular modo offline"} onClick={toggleOffline}>
          <WifiOff className={offline ? "size-5 text-warning" : "size-5"} />
        </IconAction>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
              <Bell className="size-5" />
              <Badge className="absolute right-1 top-1 size-2 rounded-full p-0" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              ["Nova mensagem de Mariana Duarte", "há 4 minutos"],
              ["Armazenamento em 78% da cota", "há 2 horas"],
              ["DKIM pendente em bocanoticias.com.br", "ontem"],
            ].map(([t, s]) => (
              <DropdownMenuItem key={t} className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{t}</span>
                <span className="text-xs text-muted-foreground">{s}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <IconAction label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"} onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </IconAction>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`ml-1 flex size-9 items-center justify-center rounded-full text-sm font-semibold ${avatarTone(me.email)}`}
              aria-label="Menu da conta"
            >
              {initials(me.name)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col">
              <span>{me.name}</span>
              <span className="text-xs font-normal text-muted-foreground">{me.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/minha-conta">
                <UserCircle className="size-4" aria-hidden /> Minha conta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes">
                <Settings className="size-4" aria-hidden /> Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Sessão encerrada (demonstração)")}>
              <LogOut className="size-4" aria-hidden /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  );
}
