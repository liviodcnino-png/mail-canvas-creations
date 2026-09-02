import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { HardDrive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricCard, PageHeader } from "@/components/admin/admin-ui";
import { adminStorageBreakdown, adminUsers } from "@/lib/mail/data";

export const Route = createFileRoute("/admin/armazenamento")({
  head: () => ({
    meta: [
      { title: "Armazenamento — BOCA MAIL Admin" },
      { name: "description", content: "Consumo de armazenamento por tipo de conteúdo e por conta." },
      { property: "og:title", content: "Armazenamento — BOCA MAIL Admin" },
      { property: "og:description", content: "Consumo por tipo de conteúdo e por conta." },
    ],
  }),
  component: AdminStorage,
});

function AdminStorage() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Armazenamento" description="Uso agregado das caixas da organização" />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total usado" value="905 GB" hint="60% de 1,5 TB" icon={HardDrive} />
        <MetricCard label="Anexos" value="428 GB" hint="47% do total" icon={HardDrive} />
        <MetricCard label="Lixeira" value="62 GB" hint="Liberável com limpeza" icon={HardDrive} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por tipo</CardTitle>
            <CardDescription>Em gigabytes</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminStorageBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <RTooltip />
                <Bar dataKey="valor" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uso por conta</CardTitle>
            <CardDescription>Percentual da cota contratada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminUsers.slice(0, 8).map((u) => (
              <div key={u.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{u.email}</span>
                  <span className="text-muted-foreground">{u.usedGb} GB</span>
                </div>
                <Progress value={(u.usedGb / u.quotaGb) * 100} aria-label={`Uso de ${u.email}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
