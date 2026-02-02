'use client'

import { useFormContext } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

import { DashedCard } from '@/components/ui/dashed-card'
import { cn } from '@/lib/utils'

export function StepPackaging() {
  const { control, setValue } = useFormContext<QuoteFormData>()

  return (
    <div className="space-y-10">
      <p className="text-muted-foreground text-base">
        Comment souhaitez-vous que vos produits soient emballés ?
      </p>

      {/* Packaging Section */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-4 bg-muted/20">
        <h3 className="font-semibold text-foreground text-base">Conditionnement</h3>
        
        <FormField
          control={control}
          name="packagingType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(['non', 'a_lunite', 'par_paquet', 'par_2', 'par_3', 'par_4', 'par_5_10'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue('packagingType', option, { shouldValidate: true })}
                      className="h-full focus:outline-none"
                    >
                      <DashedCard
                        className={cn(
                          "flex items-center justify-center p-4 transition-all duration-200 cursor-pointer h-full min-h-[60px]",
                          field.value === option && "bg-primary/5"
                        )}
                        active={field.value === option}
                        color="primary"
                      >
                        <span className={cn(
                          "font-medium text-sm text-center leading-tight",
                          field.value === option ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {FRENCH_LABELS.packaging[option]}
                        </span>
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

      <div className="border border-dashed border-emerald-500/50 rounded-lg p-5 bg-emerald-500/5">
        <p className="font-semibold text-foreground text-sm mb-2">Note sur le colisage :</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pour garantir la protection des documents et respecter les normes de sécurité (15kg max par colis), 
          un coût forfaitaire de 1.85€ par carton est appliqué.
        </p>
      </div>
    </div>
  )
}
