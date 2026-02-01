"use client";

import { useEffect, useState } from "react";
import { Briefcase, Euro, TrendingUp, Users } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";

interface KPIData {
  totalQuotes: number;
  totalValue: number;
  averageValue: number;
  quotesThisMonth: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
}

function KPICard({ title, value, description, icon, loading }: KPICardProps) {
  const { theme } = useTheme();
  
  return (
    <MagicCard 
      className="flex flex-col rounded-[12px] bg-card text-card-foreground shadow-none"
      gradientColor={theme === "dark" ? "#262626" : "#f1f1f1"}
      gradientOpacity={0.5}
    >
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="p-6 pt-0">
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </MagicCard>
  );
}

export function KPICards() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) {
          setData(json.stats);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Devis"
        value={data?.totalQuotes || 0}
        description="devis créés au total"
        icon={<Briefcase className="h-5 w-5" />}
        loading={loading}
      />
      <KPICard
        title="Valeur Totale"
        value={formatCurrency(data?.totalValue || 0)}
        description="valeur estimée cumulée"
        icon={<Euro className="h-5 w-5" />}
        loading={loading}
      />
      <KPICard
        title="Devis ce mois"
        value={data?.quotesThisMonth || 0}
        description="nouveaux devis"
        icon={<Users className="h-5 w-5" />}
        loading={loading}
      />
      <KPICard
        title="Valeur moyenne"
        value={formatCurrency(data?.averageValue || 0)}
        description="moyenne par devis"
        icon={<TrendingUp className="h-5 w-5" />}
        loading={loading}
      />
    </div>
  );
}
