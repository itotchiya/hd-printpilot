'use client'

import { useFormContext } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Printer, Factory } from 'lucide-react'
import { DashedCard } from '@/components/ui/dashed-card'
import { cn } from '@/lib/utils'

export function StepPrintMode() {
  const { control, watch } = useFormContext<QuoteFormData>()
  const selectedMode = watch('printMode')

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Sélectionnez le mode d&apos;impression adapté à votre projet.
      </p>

      <FormField
        control={control}
        name="printMode"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ''}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Digital option */}
                <div className="h-full">
                  <RadioGroupItem
                    value="digital"
                    id="digital"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="digital"
                    className="block cursor-pointer h-full"
                  >
                      <DashedCard
                        className={cn(
                          "flex flex-col items-center text-center h-full p-10 transition-all duration-300 relative group/card",
                          selectedMode === 'digital' && "bg-blue-500/5"
                        )}
                        active={selectedMode === 'digital'}
                        color="blue"
                      >
                      <div className="mb-8 flex items-center justify-center">
                        <Printer className={cn(
                          "w-12 h-12 transition-colors duration-300",
                          selectedMode === 'digital' ? "text-blue-500" : "text-blue-500/50"
                        )} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                        {FRENCH_LABELS.printMode.digital}
                      </h3>
                      
                      <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-[240px]">
                        Solution idéale pour vos <span className="text-foreground/90 font-semibold underline decoration-blue-500/30 underline-offset-4">petits tirages</span> (1 à 500 ex)
                      </p>

                      <div className="mt-auto w-full pt-8 border-t border-border/50">
                        <ul className="space-y-3 text-sm text-left mx-auto max-w-[200px]">
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-blue-500/80" />
                            Production express (48h)
                          </li>
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-blue-500/80" />
                            Données variables & QR
                          </li>
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-blue-500/80" />
                            Flexibilité totale
                          </li>
                        </ul>
                      </div>
                    </DashedCard>
                  </Label>
                </div>

                {/* Offset option */}
                <div className="h-full">
                  <RadioGroupItem
                    value="offset"
                    id="offset"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="offset"
                    className="block cursor-pointer h-full"
                  >
                    <DashedCard
                      className={cn(
                        "flex flex-col items-center text-center h-full p-10 transition-all duration-300 relative group/card",
                        selectedMode === 'offset' && "bg-orange-500/5"
                      )}
                      active={selectedMode === 'offset'}
                      color="orange"
                    >
                      <div className="mb-8 flex items-center justify-center">
                        <Factory className={cn(
                          "w-12 h-12 transition-colors duration-300",
                          selectedMode === 'offset' ? "text-orange-500" : "text-orange-500/50"
                        )} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                        {FRENCH_LABELS.printMode.offset}
                      </h3>
                      
                      <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-[240px]">
                        L&apos;excellence pour vos <span className="text-foreground/90 font-semibold underline decoration-orange-500/30 underline-offset-4">grands volumes</span> (500+ ex)
                      </p>

                      <div className="mt-auto w-full pt-8 border-t border-border/50">
                        <ul className="space-y-3 text-sm text-left mx-auto max-w-[200px]">
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-orange-500/80" />
                            Coût d&apos;unité imbattable
                          </li>
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-orange-500/80" />
                            Large choix de papiers
                          </li>
                          <li className="flex items-center gap-3 text-muted-foreground/90">
                            <div className="h-2 w-2 rounded-full bg-orange-500/80" />
                            Fidélité colorimétrique
                          </li>
                        </ul>
                      </div>
                    </DashedCard>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border border-dashed border-primary/30 rounded-lg p-4 mt-8">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Conseil :</strong> Pour les quantités supérieures à 300 exemplaires, 
          nous comparerons automatiquement les prix numérique et offset pour vous 
          proposer la solution la plus économique.
        </p>
      </div>
    </div>
  )
}
