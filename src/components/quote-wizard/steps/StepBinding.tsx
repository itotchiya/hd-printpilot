'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS, PrintMode } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashedCard } from '@/components/ui/dashed-card'
import { cn } from '@/lib/utils'

interface StepBindingProps {
  printMode?: PrintMode
}

export function StepBinding({ printMode }: StepBindingProps) {
  const { control, setValue } = useFormContext<QuoteFormData>()
  const bindingType = useWatch({ control, name: 'bindingType' })
  const laminationOrientation = useWatch({ control, name: 'laminationOrientation' })
  const coverPages = useWatch({ control, name: 'coverPages' })

  const isOffset = printMode === 'offset'
  const hasCover = coverPages !== '0'
  const hasLamination = laminationOrientation && laminationOrientation !== 'non'

  // Binding options differ for digital vs offset
  const bindingOptions = isOffset
    ? (['rien', 'dos_carre_colle', 'dos_carre_colle_pur', 'dos_carre_colle_couture', 'piqure'] as const)
    : (['rien', 'dos_carre_colle', 'dos_carre_colle_pur', 'piqure'] as const)

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Choisissez le type de reliure et les options de finition pour votre document.
      </p>

      {/* Section: Binding Type */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-4 bg-muted/20">
        <h3 className="font-semibold text-foreground text-base">Type de reliure</h3>
        
        <FormField
          control={control}
          name="bindingType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bindingOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue('bindingType', option, { shouldValidate: true })}
                      className="w-full text-left"
                    >
                      <DashedCard
                        className={cn(
                          "p-4 transition-all duration-200 cursor-pointer h-full",
                          field.value === option && "bg-primary/5"
                        )}
                        active={field.value === option}
                        color="primary"
                      >
                        <div className="flex flex-col gap-1 pr-6">
                          <span className="font-medium text-foreground text-sm">
                            {FRENCH_LABELS.binding[option]}
                          </span>
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            {getBindingDescription(option)}
                          </span>
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

      {/* Section: Lamination (only if has cover) */}
      {hasCover && (
        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-6 bg-muted/20">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground text-base">Pelliculage</h3>
            <p className="text-xs text-muted-foreground">
              Le pelliculage protège la couverture et améliore son aspect visuel.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <FormField
              control={control}
              name="laminationOrientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Application</FormLabel>
                   <Select onValueChange={(val) => {
                      field.onChange(val);
                      // If changing to 'non', clear the finish
                      if(val === 'non') {
                        setValue('laminationFinish', undefined as unknown as any)
                      }
                    }} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full bg-background">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['non', 'recto', 'recto_verso'] as const).map((option) => (
                        <SelectItem key={option} value={option}>
                          {FRENCH_LABELS.laminationOrientation[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn("transition-all duration-300", !hasLamination ? "opacity-50 pointer-events-none" : "opacity-100")}>
            <FormField
              control={control}
              name="laminationFinish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm font-medium", !hasLamination && "text-muted-foreground")}>
                    Finition
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                    disabled={!hasLamination}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full bg-background">
                        <SelectValue placeholder={hasLamination ? "Sélectionner..." : "Choisir d'abord l'application"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['mat', 'brillant', 'soft_touch'] as const).map((option) => (
                        <SelectItem key={option} value={option}>
                          {FRENCH_LABELS.laminationFinish[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </div>
        </div>
      )}

      {/* Section: Binding Info (Dashed Orange Alert) */}
      <div className="border border-dashed border-amber-500/50 rounded-lg p-5 bg-amber-500/5">
        <p className="font-semibold text-foreground text-sm mb-3">À savoir :</p>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Dos carré collé :</strong> aspect livre classique (min. 40 pages)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Dos carré collé PUR :</strong> colle plus résistante</span>
          </li>
          {isOffset && (
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Avec couture :</strong> solidité maximale pour usage intensif</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Piqûre :</strong> agrafes métalliques (max. 96 pages)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function getBindingDescription(option: string): string {
  const descriptions: Record<string, string> = {
    rien: 'Feuilles volantes, sans assemblage',
    dos_carre_colle: 'Dos plat avec colle, aspect livre',
    dos_carre_colle_pur: 'Colle polyuréthane, plus résistante',
    dos_carre_colle_couture: 'Couture + colle, très solide',
    piqure: 'Agrafes métalliques au centre',
  }
  return descriptions[option] || ''
}
