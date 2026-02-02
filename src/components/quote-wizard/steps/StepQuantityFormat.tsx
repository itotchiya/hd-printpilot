'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { QuoteFormData } from '@/lib/schemas/quote-schema'
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
import { cn } from '@/lib/utils'

const PRESET_FORMATS = [
  { label: 'A4', value: '21x29,7' },
  { label: 'A5', value: '14,8x21' },
  { label: 'A6', value: '10,5x14,8' },
  { label: 'Carré 21', value: '21x21' },
  { label: 'DL', value: '10x21' },
  { label: 'A4 Paysage', value: '29,7x21' },
  { label: 'Carte visite', value: '8,5x5,4' },
]

export function StepQuantityFormat() {
  const { control, setValue, watch } = useFormContext<QuoteFormData>()
  const [isCustomFormat, setIsCustomFormat] = useState(false)
  const selectedFormat = watch('format')

  const handleFormatSelect = (value: string) => {
    setValue('format', value, { shouldValidate: true })
    setIsCustomFormat(false)
  }

  const handleCustomClick = () => {
    setIsCustomFormat(true)
    setValue('format', '', { shouldValidate: true })
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Indiquez la quantité d&apos;exemplaires souhaitée et le format final de votre document.
      </p>

      {/* Section: Quantity */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Quantité (exemplaires)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 500"
                  className="h-11"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Nombre total d&apos;exemplaires à imprimer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section: Format Selection Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Sélectionnez un format :</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESET_FORMATS.map((format) => (
            <button
              key={format.label}
              type="button"
              onClick={() => handleFormatSelect(format.value)}
            >
              <DashedCard
                className={cn(
                  "flex flex-col items-center justify-center text-center p-4 transition-all duration-200 cursor-pointer h-full",
                  selectedFormat === format.value && !isCustomFormat && "bg-primary/5"
                )}
                active={selectedFormat === format.value && !isCustomFormat}
                color="primary"
              >
                <span className="font-medium text-foreground text-sm">{format.label}</span>
                <span className="block text-xs text-muted-foreground mt-1">{format.value}</span>
              </DashedCard>
            </button>
          ))}
          
          {/* Personnalisé Card */}
          <button
            type="button"
            onClick={handleCustomClick}
          >
            <DashedCard
              className={cn(
                "flex flex-col items-center justify-center text-center p-4 transition-all duration-200 cursor-pointer h-full",
                isCustomFormat && "bg-primary/5"
              )}
              active={isCustomFormat}
              color="primary"
            >
              <span className="font-medium text-foreground text-sm">Personnalisé</span>
            </DashedCard>
          </button>
        </div>
      </div>

      {/* Section: Format Input (below cards) */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Format fini (cm)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ex: 21x29,7"
                  className="h-11"
                  disabled={!isCustomFormat}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {isCustomFormat 
                  ? "Saisissez votre format personnalisé (Largeur x Hauteur)"
                  : "Format sélectionné - Cliquez sur 'Personnalisé' pour modifier"
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
