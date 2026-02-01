'use client'

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

export function StepQuantityFormat() {
  const { control } = useFormContext<QuoteFormData>()

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Indiquez la quantité d&apos;exemplaires souhaitée et le format final de votre document.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quantity */}
        <FormField
          control={control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité (exemplaires)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 500"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Nombre total d&apos;exemplaires à imprimer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Format */}
        <FormField
          control={control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format fini (cm)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Ex: 21x29,7"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Largeur x Hauteur en centimètres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Common formats */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Formats courants :</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'A4', value: '21x29,7' },
            { label: 'A5', value: '14,8x21' },
            { label: 'A6', value: '10,5x14,8' },
            { label: 'Carré 21', value: '21x21' },
            { label: 'DL', value: '10x21' },
            { label: 'A4 Paysage', value: '29,7x21' },
            { label: 'Carte visite', value: '8,5x5,4' },
            { label: 'Personnalisé', value: '' },
          ].map((format) => (
            <FormatButton
              key={format.label}
              label={format.label}
              value={format.value}
              onSelect={() => {
                if (format.value) {
                  const formatField = document.querySelector('input[name="format"]') as HTMLInputElement
                  if (formatField) {
                    formatField.value = format.value
                    formatField.dispatchEvent(new Event('input', { bubbles: true }))
                  }
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FormatButton({ 
  label, 
  value, 
  onSelect 
}: { 
  label: string
  value: string
  onSelect: () => void 
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
    >
      <span className="font-medium">{label}</span>
      {value && (
        <span className="block text-xs text-slate-500">{value}</span>
      )}
    </button>
  )
}
