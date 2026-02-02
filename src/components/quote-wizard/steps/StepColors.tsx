'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS, PrintMode } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { DashedCard } from '@/components/ui/dashed-card'
import { cn } from '@/lib/utils'

interface StepColorsProps {
  printMode?: PrintMode
}

export function StepColors({ printMode }: StepColorsProps) {
  const { control, setValue } = useFormContext<QuoteFormData>()
  const coverPages = useWatch({ control, name: 'coverPages' })

  const hasCover = coverPages !== '0'
  const isOffset = printMode === 'offset'

  // Digital only has quadrichromie and noir
  // Offset has all options
  const colorOptions = isOffset
    ? (['quadrichromie', 'quadrichromie_vernis', 'bichromie', 'noir'] as const)
    : (['quadrichromie', 'noir'] as const)

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Sélectionnez les couleurs d&apos;impression pour l&apos;intérieur et la couverture.
      </p>

      {/* Section: Interior Colors */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-4 bg-muted/20">
        <h3 className="font-semibold text-foreground text-base">Couleurs intérieures</h3>
        
        <FormField
          control={control}
          name="interiorColors"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue('interiorColors', option, { shouldValidate: true })}
                      className="w-full"
                    >
                      <DashedCard
                        className={cn(
                          "p-4 transition-all duration-200 cursor-pointer w-full",
                          field.value === option && "bg-primary/5"
                        )}
                        active={field.value === option}
                        color="primary"
                      >
                        <div className="flex flex-row items-center gap-3 w-full">
                          <ColorIndicator option={option} />
                          <span className="font-medium text-foreground text-sm flex-1 text-left">{FRENCH_LABELS.colors[option]}</span>
                        </div>
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

      {/* Section: Cover Colors (only if has cover) */}
      {hasCover && (
        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-4 bg-muted/20">
          <h3 className="font-semibold text-foreground text-base">Couleurs couverture</h3>
          
          <FormField
            control={control}
            name="coverColors"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setValue('coverColors', option, { shouldValidate: true })}
                        className="w-full"
                      >
                        <DashedCard
                        className={cn(
                          "p-4 transition-all duration-200 cursor-pointer w-full",
                          field.value === option && "bg-primary/5"
                        )}
                        active={field.value === option}
                        color="primary"
                      >
                        <div className="flex flex-row items-center gap-3 w-full">
                          <ColorIndicator option={option} />
                          <span className="font-medium text-foreground text-sm flex-1 text-left">{FRENCH_LABELS.colors[option]}</span>
                        </div>
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
      )}

      {/* Section: Color Types Info (Dashed Orange Alert) */}
      <div className="border border-dashed border-amber-500/50 rounded-lg p-5 bg-amber-500/5">
        <p className="font-semibold text-foreground text-sm mb-3">Types d&apos;impression :</p>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Quadrichromie (CMJN) :</strong> impression couleur standard</span>
          </li>
          {isOffset && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Quadrichromie + Vernis :</strong> protection et brillance supplémentaire</span>
            </li>
          )}
          {isOffset && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Bichromie :</strong> deux couleurs (économique pour grands tirages)</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Noir :</strong> impression monochrome (plus économique)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function ColorIndicator({ option }: { option: string }) {
  const colors: Record<string, string> = {
    quadrichromie: 'bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400',
    quadrichromie_vernis: 'bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400 ring-2 ring-primary/20',
    bichromie: 'bg-gradient-to-r from-blue-500 to-red-500',
    noir: 'bg-black ring-1 ring-white/20',
  }

  return (
    <div className={`w-10 h-10 rounded-full flex-shrink-0 ${colors[option] || 'bg-muted'}`} />
  )
}
