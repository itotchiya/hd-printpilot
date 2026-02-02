'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { DashedCard } from '@/components/ui/dashed-card'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  FileText, 
  Contact, 
  LayoutPanelLeft
} from 'lucide-react'

export function StepProductOptions() {
  const { control, setValue } = useFormContext<QuoteFormData>()
  const selectedProduct = useWatch({ control, name: 'productType' })
  const foldType = useWatch({ control, name: 'foldType' })

  const isDepliant = selectedProduct === 'depliant'
  const hasFold = isDepliant && foldType && foldType !== 'rien'

  return (
    <div className="space-y-10">
      <p className="text-muted-foreground text-base">
        Définissez le type de produit et les options de pliage si applicable.
      </p>

      {/* Product Type Section */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 space-y-4 bg-muted/20">
        <h3 className="font-semibold text-foreground text-base">Type de produit</h3>
        
        <FormField
          control={control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['brochure', 'flyer_poster', 'carte_visite', 'depliant'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue('productType', option, { shouldValidate: true })}
                      className="h-full focus:outline-none"
                    >
                      <DashedCard
                        className={cn(
                          "flex flex-col items-center justify-center p-6 h-full transition-all duration-300 relative aspect-square",
                          field.value === option && "bg-primary/5"
                        )}
                        active={field.value === option}
                        color="primary"
                      >
                        <div className="mb-4 flex items-center justify-center">
                          {ProductIcon(option, field.value === option)}
                        </div>
                        
                        <span className={cn(
                          "font-bold text-sm text-center transition-colors leading-tight",
                          field.value === option ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {FRENCH_LABELS.productType[option]}
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

      {/* Fold Options Section - only for Depliant */}
      {isDepliant && (
        <div className="border border-dashed border-amber-500/50 rounded-lg p-6 space-y-6 bg-amber-500/5">
          <h3 className="font-semibold text-foreground text-base">Options de pliage</h3>
          
          <div className="flex flex-col gap-6">
            <FormField
              control={control}
              name="foldType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Type de pli</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['rien', 'roule', 'accordeon', 'croise'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setValue('foldType', option, { shouldValidate: true })}
                          className="focus:outline-none h-full"
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
                              {FRENCH_LABELS.foldType[option]}
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

            <div className={cn("flex flex-col gap-6 transition-all duration-300", !hasFold ? "opacity-50 pointer-events-none hidden" : "opacity-100 flex")}>
                <FormField
                  control={control}
                  name="foldCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nombre de plis</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={6}
                          placeholder="Ex: 2"
                          className="h-11 w-full bg-background"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="secondaryFoldType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Pliage secondaire</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-4">
                          {(['rien', 'croise'] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setValue('secondaryFoldType', option, { shouldValidate: true })}
                              className="focus:outline-none"
                            >
                              <DashedCard
                                className={cn(
                                  "flex items-center justify-center p-4 transition-all duration-200 cursor-pointer h-full min-h-[50px]",
                                  field.value === option && "bg-primary/5"
                                )}
                                active={field.value === option}
                                color="primary"
                              >
                                <span className={cn(
                                  "font-medium text-sm text-center leading-tight",
                                  field.value === option ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  {FRENCH_LABELS.foldType[option]}
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
          </div>
        </div>
      )}

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
    </div>
  )
}

function ProductIcon(option: string, isActive: boolean) {
  const props = {
    className: cn("w-10 h-10 transition-colors", isActive ? "text-primary" : "text-muted-foreground/50")
  }
  
  switch (option) {
    case 'brochure': return <BookOpen {...props} />
    case 'flyer_poster': return <FileText {...props} />
    case 'carte_visite': return <Contact {...props} />
    case 'depliant': return <LayoutPanelLeft {...props} />
    default: return <FileText {...props} />
  }
}
