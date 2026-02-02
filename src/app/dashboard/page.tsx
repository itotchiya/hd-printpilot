import { KPICards } from "@/components/dashboard/KPICards";
import { QuotesTable } from "@/components/dashboard/QuotesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord HD-PrintPilot.
          </p>
        </div>
        <Link href="/dashboard/devis/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau
          </Button>
        </Link>
      </div>

      <KPICards />

      <div className="grid gap-6">
        <QuotesTable limit={5} />
      </div>
    </div>
  );
}
