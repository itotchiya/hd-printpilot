'use client'

import { useFormContext } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepReviewProps {
  onEditStep: (step: number) => void
}

export function StepReview({ onEditStep }: StepReviewProps) {
  const { watch } = useFormContext<QuoteFormData>()
  const data = watch()

  const hasCover = data.coverPages !== '0'
  const hasLamination = data.laminationOrientation && data.laminationOrientation !== 'non'
  const hasFold = data.productType === 'depliant' && data.foldType && data.foldType !== 'rien'

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-base">
        Vérifiez les détails de votre commande avant de calculer le devis.
      </p>

      {/* Main Review Container - Dashed Style */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-8 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          
          {/* Print mode & Quantity */}
          <ReviewSection title="Impression" onEdit={() => onEditStep(1)}>
            <ReviewRow label="Mode" value={data.printMode ? FRENCH_LABELS.printMode[data.printMode] : '-'} />
            <ReviewRow label="Quantité" value={`${data.quantity || 0} exemplaires`} />
            <ReviewRow label="Format" value={data.format || '-'} />
          </ReviewSection>

          {/* Pages */}
          <ReviewSection title="Pages" onEdit={() => onEditStep(3)}>
            <ReviewRow label="Pages intérieures" value={`${data.interiorPages || 0} pages`} />
            <ReviewRow label="Couverture" value={data.coverPages ? FRENCH_LABELS.coverPages[data.coverPages] : '-'} />
            {data.rabatWidth && <ReviewRow label="Largeur rabat" value={`${data.rabatWidth} cm`} />}
          </ReviewSection>

          {/* Paper */}
          <ReviewSection title="Papier" onEdit={() => onEditStep(4)}>
            <ReviewRow 
              label="Intérieur" 
              value={`${data.interiorPaperType || '-'} ${data.interiorGrammage ? `(${data.interiorGrammage}g)` : ''}`} 
            />
            {hasCover && (
              <ReviewRow 
                label="Couverture" 
                value={`${data.coverPaperType || '-'} ${data.coverGrammage ? `(${data.coverGrammage}g)` : ''}`} 
              />
            )}
          </ReviewSection>

          {/* Colors */}
          <ReviewSection title="Couleurs" onEdit={() => onEditStep(5)}>
            <ReviewRow 
              label="Intérieur" 
              value={data.interiorColors ? FRENCH_LABELS.colors[data.interiorColors] : '-'} 
            />
            {hasCover && (
              <ReviewRow 
                label="Couverture" 
                value={data.coverColors ? FRENCH_LABELS.colors[data.coverColors] : '-'} 
              />
            )}
          </ReviewSection>

          {/* Binding & Finishing */}
          <ReviewSection title="Reliure & Finition" onEdit={() => onEditStep(6)}>
            <ReviewRow 
              label="Reliure" 
              value={data.bindingType ? FRENCH_LABELS.binding[data.bindingType] : '-'} 
            />
            {hasCover && hasLamination && (
              <ReviewRow 
                label="Pelliculage" 
                value={`${FRENCH_LABELS.laminationOrientation[data.laminationOrientation!]} - ${data.laminationFinish ? FRENCH_LABELS.laminationFinish[data.laminationFinish] : ''}`} 
              />
            )}
          </ReviewSection>

          {/* Product Options */}
          <ReviewSection title="Produit" onEdit={() => onEditStep(7)}>
            <ReviewRow 
              label="Type" 
              value={data.productType ? FRENCH_LABELS.productType[data.productType] : '-'} 
            />
            {hasFold && (
              <ReviewRow 
                label="Pliage" 
                value={`${FRENCH_LABELS.foldType[data.foldType!]} (${data.foldCount || 0} plis)`} 
              />
            )}
            <ReviewRow 
              label="Conditionnement" 
              value={data.packagingType ? FRENCH_LABELS.packaging[data.packagingType] : '-'} 
            />
          </ReviewSection>

          {/* Delivery - Full Width on Mobile, but Grid Item on Desktop */}
          <ReviewSection title="Livraison" onEdit={() => onEditStep(8)} className="md:col-span-2">
            <div className="space-y-2">
              {data.deliveries && data.deliveries.length > 0 ? (
                data.deliveries.map((delivery, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b border-muted-foreground/10 last:border-0 pb-1 last:pb-0">
                    <span className="text-muted-foreground font-medium">Destination {index + 1}</span>
                    <span className="text-foreground">
                      {delivery.quantity} ex. à <span className="font-semibold">{delivery.department}</span>
                      {delivery.tailLift && <span className="text-xs ml-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded">Hayon</span>}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">Aucune destination configurée</p>
              )}
            </div>
          </ReviewSection>

        </div>
      </div>

      {/* Call to action */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 text-center shadow-none">
        <p className="text-primary font-bold text-lg">
          ✓ Tout est prêt !
        </p>
        <p className="text-primary/80 mt-1">
          Confirmez vos choix pour calculer le devis estimatif.
        </p>
      </div>
    </div>
  )
}

function ReviewSection({ 
  title, 
  children, 
  onEdit, 
  className 
}: { 
  title: string; 
  children: React.ReactNode; 
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center border-b border-muted-foreground/20 pb-2">
        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">{title}</h3>
        {onEdit && (
          <button 
            type="button" 
            onClick={onEdit}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Modifier</span>
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm items-baseline gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground font-medium text-right truncate">{value}</span>
    </div>
  )
}
