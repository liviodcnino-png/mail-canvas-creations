import { createFileRoute } from "@tanstack/react-router";
import { Activity, MailCheck, MailX, Timer } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricCard, PageHeader } from "@/components/admin/admin-ui";
import { adminTraffic } from "@/lib/mail/data";

export const Route = createFileRoute("/admin/estatisticas")({
  head: () => ({
    meta: [
      { title: "Estatísticas — BOCA MAIL Admin" },
      { name: "description", content: "Taxa de entrega, rejeições, spam e tempo médio de resposta." },
      { property: "og:title", content: "Estatísticas — BOCA MAIL Admin" },
      { property: "og:description", content: "Entrega, rejeições, spam e tempo de resposta." },
    ],
  }),
  component: AdminStats,
});

function AdminStats() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Estatísticas" description="Qualidade de entrega e engajamento das contas" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Taxa de entrega" value="99,2%" hint="Últimos 30 dias" icon={MailCheck} />
        <MetricCard label="Rejeições" value="0,8%" hint="Principalmente caixas inexistentes" icon={MailX} />
        <MetricCard label="Spam detectado" value="3.140" hint="Bloqueado antes da entrega" icon={Activity} />
        <MetricCard label="Tempo médio de resposta" value="2h 14min" hint="Equipe de redação" icon={Timer} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Volume diário</CardTitle>
          <CardDescription>Comparativo entre mensagens recebidas e enviadas</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <RTooltip />
              <Line type="monotone" dataKey="recebidos" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="enviados" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Engajamento por domínio</CardTitle>
          <CardDescription>Percentual de mensagens abertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ["bocamail.com.br", 78],
            ["bocanoticias.com.br", 64],
            ["redacaoboca.com.br", 52],
            ["bocaprojetos.com", 41],
          ].map(([d, v]) => (
            <div key={d as string} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>{d}</span>
                <span className="text-muted-foreground">{v}%</span>
              </div>
              <Progress value={v as number} aria-label={`Engajamento de ${d}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
