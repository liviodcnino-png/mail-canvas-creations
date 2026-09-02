import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  BarChart3,
  Clock,
  FileText,
  Folder,
  Globe,
  HardDrive,
  Inbox,
  LayoutDashboard,
  Mail,
  Pencil,
  Plus,
  ScrollText,
  Send,
  Settings,
  ShieldAlert,
  Star,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { BocaLogo } from "./logo";
import { useMail } from "@/lib/mail/store";
import { cn } from "@/lib/utils";

const linkClass =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground min-h-9";
const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground font-semibold";

function NavItem({
  to,
  icon: Icon,
  label,
  count,
  onNavigate,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  count?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={linkClass}
      activeOptions={{ exact: to === "/" || to === "/admin" }}
      activeProps={{ className: activeClass, "aria-current": "page" }}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">{label}</span>
      {!!count && (
        <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-[11px]">
          {count}
        </Badge>
      )}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { counts, folders, addFolder, openComposer } = useMail();
  const [newFolderOpen, setNewFolderOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center px-4">
        <Link to="/" onClick={onNavigate} aria-label="BOCA MAIL — ir para a caixa de entrada">
          <BocaLogo />
        </Link>
      </div>

      <div className="px-3 pb-2">
        <Button
          className="boca-gradient h-11 w-full justify-center gap-2 text-primary-foreground shadow-sm transition-transform hover:scale-[1.01]"
          onClick={() => {
            openComposer();
            onNavigate?.();
          }}
        >
          <Pencil className="size-4" aria-hidden /> Escrever
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="pb-4" aria-label="Navegação principal">
          <NavItem to="/" icon={Inbox} label="Caixa de entrada" count={counts.inbox} onNavigate={onNavigate} />
          <NavItem to="/favoritos" icon={Star} label="Favoritos" count={counts.starred} onNavigate={onNavigate} />
          <NavItem to="/adiados" icon={Clock} label="Adiados" count={counts.snoozed} onNavigate={onNavigate} />
          <NavItem to="/enviados" icon={Send} label="Enviados" onNavigate={onNavigate} />
          <NavItem to="/rascunhos" icon={FileText} label="Rascunhos" count={counts.drafts} onNavigate={onNavigate} />
          <NavItem to="/arquivados" icon={Archive} label="Arquivados" onNavigate={onNavigate} />
          <NavItem to="/spam" icon={ShieldAlert} label="Spam" count={counts.spam} onNavigate={onNavigate} />
          <NavItem to="/lixeira" icon={Trash2} label="Lixeira" count={counts.trash} onNavigate={onNavigate} />

          <SectionTitle>Pastas</SectionTitle>
          {folders.map((f) => (
            <Link
              key={f.slug}
              to="/pasta/$slug"
              params={{ slug: f.slug }}
              onClick={onNavigate}
              className={linkClass}
              activeProps={{ className: activeClass, "aria-current": "page" }}
            >
              <Folder className="size-4 shrink-0" aria-hidden />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.count}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setNewFolderOpen(true)}
            className={cn(linkClass, "w-full text-muted-foreground")}
          >
            <Plus className="size-4" aria-hidden /> Nova pasta
          </button>

          <SectionTitle>Espaço de trabalho</SectionTitle>
          <NavItem to="/contatos" icon={Users} label="Contatos" onNavigate={onNavigate} />
          <NavItem to="/contas" icon={Mail} label="Contas de e-mail" onNavigate={onNavigate} />

          <SectionTitle>Administração</SectionTitle>
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" onNavigate={onNavigate} />
          <NavItem to="/admin/usuarios" icon={Users} label="Usuários" onNavigate={onNavigate} />
          <NavItem to="/admin/contas" icon={Mail} label="Contas" onNavigate={onNavigate} />
          <NavItem to="/admin/dominios" icon={Globe} label="Domínios" onNavigate={onNavigate} />
          <NavItem to="/admin/armazenamento" icon={HardDrive} label="Armazenamento" onNavigate={onNavigate} />
          <NavItem to="/admin/estatisticas" icon={BarChart3} label="Estatísticas" onNavigate={onNavigate} />
          <NavItem to="/admin/logs" icon={ScrollText} label="Logs" onNavigate={onNavigate} />
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <NavItem to="/configuracoes" icon={Settings} label="Configurações" onNavigate={onNavigate} />
        <NavItem to="/minha-conta" icon={UserCircle} label="Minha conta" onNavigate={onNavigate} />
      </div>

      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova pasta</DialogTitle>
            <DialogDescription>Organize suas mensagens em pastas personalizadas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="folder-name">Nome da pasta</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Ex.: Assinantes"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!folderName.trim()}
              onClick={() => {
                addFolder(folderName.trim());
                setFolderName("");
                setNewFolderOpen(false);
              }}
            >
              Criar pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
