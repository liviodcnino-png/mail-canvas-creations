import { createFileRoute } from "@tanstack/react-router";
import { Globe, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/admin-ui";
import { adminDomains } from "@/lib/mail/data";

export const Route = createFileRoute("/admin/dominios")({
  head: () => ({
    meta: [
      { title: "Domínios — BOCA MAIL Admin" },
      { name: "description", content: "Estado de DNS, SPF, DKIM e DMARC dos domínios da organização." },
      { property: "og:title", content: "Domínios — BOCA MAIL Admin" },
      { property: "og:description", content: "DNS, SPF, DKIM e DMARC por domínio." },
    ],
  }),
  component: AdminDomains,
});

const tone: Record<string, string> = {
  ok: "border-success/40 bg-success/10 text-success",
  aviso: "border-warning/40 bg-warning/15 text-warning-foreground",
  pendente: "border-border bg-muted text-muted-foreground",
  erro: "border-destructive/40 bg-destructive/10 text-destructive",
};

function AdminDomains() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Domínios"
        description="Registros preparados para configuração futura — nenhuma verificação real é executada"
        actions={
          <Button onClick={() => toast.info("Adicionar domínio (demonstração)")}>
            <Plus className="size-4" aria-hidden /> Adicionar domínio
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {adminDomains.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe className="size-5" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">{d.domain}</CardTitle>
                  <CardDescription>
                    {d.accounts} contas · expira em {new Date(d.expires).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([["MX", d.mx], ["SPF", d.spf], ["DKIM", d.dkim], ["DMARC", d.dmarc]] as const).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border p-2 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                    <Badge variant="outline" className={`mt-1 ${tone[v]}`}>{v}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Registros DNS (demonstração)")}>
                Ver registros DNS
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
