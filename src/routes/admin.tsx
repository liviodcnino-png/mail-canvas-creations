import { createFileRoute } from "@tanstack/react-router";
import { HardDrive, Inbox, Mail, Send, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricCard, PageHeader } from "@/components/admin/admin-ui";
import { adminStorageBreakdown, adminTraffic, adminUsers } from "@/lib/mail/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard administrativo — BOCA MAIL" },
      { name: "description", content: "Métricas de usuários, contas, tráfego de e-mails e armazenamento." },
      { property: "og:title", content: "Dashboard administrativo — BOCA MAIL" },
      { property: "og:description", content: "Métricas e gráficos de operação da suite BOCA MAIL." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Dashboard" description="Visão geral da operação de e-mail da organização" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Usuários" value={String(adminUsers.length)} hint="+3 nos últimos 30 dias" icon={Users} />
        <MetricCard label="Contas de e-mail" value="85" hint="4 domínios ativos" icon={Mail} />
        <MetricCard label="Recebidos (7d)" value="12.480" hint="+18% vs. semana anterior" icon={Inbox} />
        <MetricCard label="Enviados (7d)" value="5.912" hint="99,2% de entrega" icon={Send} />
        <MetricCard label="Armazenamento" value="905 GB" hint="de 1,5 TB contratados" icon={HardDrive} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tráfego de mensagens</CardTitle>
            <CardDescription>Recebidos e enviados nos últimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <RTooltip />
                <Area type="monotone" dataKey="recebidos" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.18} />
                <Area type="monotone" dataKey="enviados" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Armazenamento por tipo</CardTitle>
            <CardDescription>Distribuição em GB</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminStorageBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <RTooltip />
                <Bar dataKey="valor" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Contas com maior uso</CardTitle>
          <CardDescription>Top 5 por consumo de cota</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminUsers.slice(0, 5).map((u) => (
            <div key={u.id} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="truncate font-medium">{u.email}</span>
                <span className="text-muted-foreground">
                  {u.usedGb} / {u.quotaGb} GB
                </span>
              </div>
              <Progress value={(u.usedGb / u.quotaGb) * 100} aria-label={`Uso de ${u.email}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
