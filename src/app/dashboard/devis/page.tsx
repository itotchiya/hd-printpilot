import { QuotesTable } from "@/components/dashboard/QuotesTable";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DevisPage() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Devis</h1>
          <p className="text-muted-foreground">Consultez et gérez l&apos;ensemble des devis générés.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un devis..." 
              className="pl-9 w-[300px]"
            />
          </div>
          <Link href="/dashboard/devis/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouveau
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <QuotesTable />
      </div>
    </div>
  );
}
