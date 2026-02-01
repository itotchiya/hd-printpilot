"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileDigit, Printer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Quote {
  id: string;
  createdAt: string;
  quantity: number;
  printMode: string;
  total: number;
  interiorPages: number;
  interiorPaperType: string;
}

export function QuotesTable({ limit }: { limit?: number }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch(`/api/quotes/list?limit=${limit || 50}`);
        const data = await res.json();
        if (data.success) {
          setQuotes(data.quotes);
        }
      } catch (err) {
        console.error("Failed to fetch quotes", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [limit]);

  const handleDownload = (id: string) => {
    window.location.href = `/api/quotes/${id}/pdf`;
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Chargement des devis...</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 flex flex-col items-center justify-center text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-1">Aucun devis trouvé</h3>
        <p className="text-muted-foreground mb-6">Commencez par créer votre premier devis.</p>
        <Button asChild>
          <Link href="/">Nouveau Devis</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-none overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{limit ? "Récent Devis" : "Liste des Devis"}</h3>
        {limit && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/devis">Voir tout</Link>
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] px-6">Référence</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qté</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right font-semibold">Total</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-medium px-6">QT-{quote.id.slice(-8).toUpperCase()}</TableCell>
                <TableCell className="text-sm">
                  {format(new Date(quote.createdAt), "dd MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Brochure {quote.interiorPages} pages</span>
                    <span className="text-xs text-muted-foreground">{quote.interiorPaperType}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{quote.quantity.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {quote.printMode === "digital" ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <FileDigit className="mr-1 h-3 w-3" /> Digital
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Printer className="mr-1 h-3 w-3" /> Offset
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(quote.total))}
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(quote.id)}
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Fixed missing imports
import Link from "next/link";
import { FileText } from "lucide-react";
