'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS, PrintMode } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DashedCard } from '@/components/ui/dashed-card'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepPagesProps {
  printMode?: PrintMode
}

const COVER_OPTIONS = [
  { value: '0', label: 'Sans couverture' },
  { value: '2', label: '2 pages (Recto)' },
  { value: '4', label: '4 pages (Recto-Verso)' },
] as const

export function StepPages({ printMode }: StepPagesProps) {
  const { control, setValue } = useFormContext<QuoteFormData>()
  const { interiorPages, coverPages } = useWatch({ control })

  const isOffset = printMode === 'offset'
  const hasCover = coverPages !== '0'

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Configurez le nombre de pages de votre document. Toute brochure doit être un multiple de 4.
      </p>

      {/* Section: Interior Pages */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="interiorPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Nombre de pages intérieures</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={4}
                  min={4}
                  placeholder="Ex: 16"
                  className="h-11"
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : undefined
                    field.onChange(val)
                  }}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Nombre de pages intérieures (doit être un multiple de 4)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section: Cover Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Type de couverture :</h3>
        <FormField
          control={control}
          name="coverPages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {COVER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('coverPages', option.value, { shouldValidate: true })}
                    >
                      <DashedCard
                        className={cn(
                          "flex flex-col items-center justify-center text-center p-4 transition-all duration-200 cursor-pointer h-full",
                          field.value === option.value && "bg-primary/5"
                        )}
                        active={field.value === option.value}
                        color="primary"
                      >
                        <span className="font-medium text-foreground text-sm">{option.label}</span>
                      </DashedCard>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section: Rabat Width (only for offset with cover) */}
      {isOffset && hasCover && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="rabatWidth"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-semibold text-foreground">Largeur du rabat (optionnel)</FormLabel>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      step={0.5}
                      min={0}
                      placeholder="Ex: 10"
                      className="h-11 max-w-[200px]"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      value={field.value ?? ''}
                    />
                    <span className="text-muted-foreground text-sm">centimètres</span>
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Pour les couvertures avec volets pliés. Règle technique : <strong>(2 × Largeur HT) + Rabat ≤ 76 cm</strong>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Section: Technical Recommendations (Dashed Warning) */}
      <div className={cn(
        "border border-dashed rounded-lg p-4",
        (interiorPages || 4) > 96 || (interiorPages || 4) < 40
          ? "border-amber-500/50 bg-amber-500/5"
          : "border-primary/30 bg-primary/5"
      )}>
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
          💡 Recommandations techniques :
        </h4>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className={cn(
            "flex items-start gap-2 transition-opacity",
            (interiorPages || 4) > 96 && "opacity-40 line-through"
          )}>
            <span className={(interiorPages || 4) <= 96 ? 'text-primary' : 'text-muted-foreground'}>•</span>
            <span className={(interiorPages || 4) <= 96 ? 'text-foreground' : ''}>
              <strong>Piqûre (agrafes) :</strong> Idéal pour votre volume actuel.
            </span>
          </li>
          <li className={cn(
            "flex items-start gap-2 transition-opacity",
            (interiorPages || 4) < 40 && "opacity-40 line-through"
          )}>
            <span className={(interiorPages || 4) >= 40 ? 'text-primary' : 'text-muted-foreground'}>•</span>
            <span className={(interiorPages || 4) >= 40 ? 'text-foreground' : ''}>
              <strong>Dos carré collé :</strong> Recommandé dès 40 pages (épaisseur min suffissante).
            </span>
          </li>
        </ul>
        {(interiorPages || 4) > 96 && (
          <p className="text-xs mt-3 text-amber-600 dark:text-amber-500 font-semibold bg-amber-500/10 p-2 rounded">
            ⚠️ Attention : Au-delà de 96 pages, la reliure par agrafes n&apos;est plus possible.
          </p>
        )}
      </div>
    </div>
  )
}
