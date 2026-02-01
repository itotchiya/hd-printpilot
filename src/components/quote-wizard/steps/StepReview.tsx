'use client'

import { useFormContext } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import { Separator } from '@/components/ui/separator'

export function StepReview() {
  const { watch } = useFormContext<QuoteFormData>()
  const data = watch()

  const hasCover = data.coverPages !== '0'
  const hasLamination = data.laminationOrientation && data.laminationOrientation !== 'non'
  const hasFold = data.productType === 'depliant' && data.foldType && data.foldType !== 'rien'

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Vérifiez les détails de votre commande avant de calculer le devis.
      </p>

      {/* Print mode & Quantity */}
      <ReviewSection title="Impression">
        <ReviewRow label="Mode" value={data.printMode ? FRENCH_LABELS.printMode[data.printMode] : '-'} />
        <ReviewRow label="Quantité" value={`${data.quantity || 0} exemplaires`} />
        <ReviewRow label="Format" value={data.format || '-'} />
      </ReviewSection>

      <Separator />

      {/* Pages */}
      <ReviewSection title="Pages">
        <ReviewRow label="Pages intérieures" value={`${data.interiorPages || 0} pages`} />
        <ReviewRow label="Couverture" value={data.coverPages ? FRENCH_LABELS.coverPages[data.coverPages] : '-'} />
        {data.rabatWidth && <ReviewRow label="Largeur rabat" value={`${data.rabatWidth} cm`} />}
      </ReviewSection>

      <Separator />

      {/* Paper */}
      <ReviewSection title="Papier">
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

      <Separator />

      {/* Colors */}
      <ReviewSection title="Couleurs">
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

      <Separator />

      {/* Binding & Finishing */}
      <ReviewSection title="Reliure & Finition">
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

      <Separator />

      {/* Product Options */}
      <ReviewSection title="Produit">
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

      <Separator />

      {/* Delivery */}
      <ReviewSection title="Livraison">
        {data.deliveries && data.deliveries.length > 0 ? (
          data.deliveries.map((delivery, index) => (
            <ReviewRow 
              key={index}
              label={`Destination ${index + 1}`}
              value={`${delivery.quantity} ex. → Dept. ${delivery.department}${delivery.tailLift ? ' (+ hayon)' : ''}`}
            />
          ))
        ) : (
          <p className="text-slate-500 text-sm">Aucune destination configurée</p>
        )}
      </ReviewSection>

      {/* Call to action */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">
          ✓ Tout est prêt !
        </p>
        <p className="text-green-700 text-sm mt-1">
          Cliquez sur &quot;Calculer le devis&quot; pour obtenir votre estimation.
        </p>
      </div>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-medium text-slate-900 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium">{value}</span>
    </div>
  )
}
