'use client'

import React from 'react'
import { 
  CheckCircle2, 
  FileText, 
  LayoutDashboard, 
  Download, 
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashedCard } from '@/components/ui/dashed-card'
import { Separator } from '@/components/ui/separator'

export interface QuoteResult {
  id: string;
  totalPrice: number;
  pricePerUnit: number;
  selectedMode: string;
  totalWeight: number;
  breakdown: {
    paperCost: number;
    printingCost: number;
    bindingCost: number;
    laminationCost: number;
    deliveryCost: number;
    subtotal: number;
    marginRate: string;
    marginAmount: number;
  };
}

interface QuoteResultViewProps {
  quoteResult: QuoteResult;
  onDownload: () => void;
  onReset: () => void;
  quantity: number;
}

export function QuoteResultView({ quoteResult, onDownload, onReset, quantity }: QuoteResultViewProps) {
  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

  const showRecommendation = 
    (quoteResult.selectedMode.toLowerCase().includes('numér') && quantity > 300) ||
    (quoteResult.selectedMode.toLowerCase().includes('offset') && quantity <= 300);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-500">
      <div className="space-y-8">
        {/* Header Success */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Devis Calculé</h2>
            <p className="text-sm text-muted-foreground font-medium">
              RÉFÉRENCE : <span className="text-foreground border-b border-primary/50">QT-{quoteResult.id.slice(-8).toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Main Price Card */}
          <DashedCard className="h-full active">
            <div className="p-8 space-y-8 flex flex-col justify-center h-full">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Total Hors Taxes</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tight text-foreground">{formatEuro(quoteResult.totalPrice)}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium italic">
                  Soit <span className="text-foreground not-italic font-bold">{formatEuro(quoteResult.pricePerUnit)}</span> par exemplaire
                </p>
              </div>

              <Separator className="bg-primary/10" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Technologie</span>
                  <span className="text-sm font-bold uppercase">{quoteResult.selectedMode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Poids Estimé</span>
                  <span className="text-sm font-bold uppercase">{quoteResult.totalWeight} KG</span>
                </div>
              </div>
            </div>
          </DashedCard>

          {/* Breakdown Card */}
          <DashedCard className="h-full">
            <div className="p-8 space-y-6 flex flex-col h-full bg-muted/20 dark:bg-muted/5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Détails du prix</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <BreakdownRow label="Papier" value={quoteResult.breakdown.paperCost} />
                <BreakdownRow label="Impression" value={quoteResult.breakdown.printingCost} />
                <BreakdownRow label="Façonnage" value={quoteResult.breakdown.bindingCost} />
                {quoteResult.breakdown.laminationCost > 0 && <BreakdownRow label="Pelliculage" value={quoteResult.breakdown.laminationCost} />}
                <BreakdownRow label="Logistique" value={quoteResult.breakdown.deliveryCost} />
              </div>
              
              <div className="pt-4 space-y-4 mt-auto">
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-xs uppercase tracking-wider">Sous-total HT</span>
                  <span className="text-2xl text-primary font-black">{formatEuro(quoteResult.breakdown.subtotal)}</span>
                </div>
                
                <div className="text-[10px] text-muted-foreground font-medium flex justify-between italic bg-background/50 p-3 rounded border border-dashed border-muted-foreground/30">
                  <span>Marge ({quoteResult.breakdown.marginRate})</span>
                  <span>{formatEuro(quoteResult.breakdown.marginAmount)}</span>
                </div>
              </div>
            </div>
          </DashedCard>
        </div>

        {/* Recommendation Alert */}
        {showRecommendation && (
          <DashedCard className="border-orange-500/30 bg-orange-500/5 overflow-hidden">
            <div className="p-5 flex gap-5 items-center">
              <div className="bg-orange-500 p-3 rounded-xl text-white shrink-0 shadow-lg shadow-orange-500/30">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-orange-900 dark:text-orange-400 text-xs uppercase tracking-[0.15em]">Note d&apos;optimisation</h4>
                <p className="text-orange-800 dark:text-orange-200/80 text-sm leading-relaxed mt-1">
                  {quoteResult.selectedMode.toLowerCase().includes('numér') ? (
                    <>Pour votre quantité de <strong>{quantity} exemplaires</strong>, le mode <strong>OFFSET</strong> est généralement plus rentable. </>
                  ) : (
                    <>Pour une petite quantité de <strong>{quantity} exemplaires</strong>, le mode <strong>NUMÉRIQUE</strong> est plus rapide et économique. </>
                  )}
                  <span className="opacity-70 block mt-1 text-xs">Ajustez vos paramètres via le bouton <strong>&quot;Nouveau Devis&quot;</strong>.</span>
                </p>
              </div>
            </div>
          </DashedCard>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto px-8 gap-2 font-bold cursor-pointer"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Tableau de bord
            </Link>
          </Button>

          <Button 
            size="lg" 
            variant="ghost" 
            className="w-full sm:w-auto px-6 text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
            onClick={onReset}
          >
            Nouveau Devis
          </Button>

          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" /> Télécharger PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{formatEuro(value)}</span>
    </div>
  );
}
