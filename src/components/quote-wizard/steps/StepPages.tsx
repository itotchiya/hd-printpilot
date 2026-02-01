'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PrintMode } from '@/lib/schemas/quote-schema'

interface StepPagesProps {
  printMode?: PrintMode
}

export function StepPages({ printMode }: StepPagesProps) {
  const { control } = useFormContext<QuoteFormData>()
  const bindingType = useWatch({ control, name: 'bindingType' })
  const coverPages = useWatch({ control, name: 'coverPages' })

  const isOffset = printMode === 'offset'
  const hasCover = coverPages !== '0'

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Configurez le nombre de pages de votre document.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interior pages */}
        <FormField
          control={control}
          name="interiorPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pages intérieures</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={4}
                  min={4}
                  placeholder="Ex: 64"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Doit être un multiple de 4 (minimum 4 pages)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover pages */}
        <FormField
          control={control}
          name="coverPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pages de couverture</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  {(['0', '2', '4'] as const).map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`cover-${value}`} />
                      <Label htmlFor={`cover-${value}`} className="cursor-pointer">
                        {FRENCH_LABELS.coverPages[value]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Rabat width - only for offset */}
      {isOffset && hasCover && (
        <FormField
          control={control}
          name="rabatWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Largeur du rabat (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.5}
                  min={0}
                  placeholder="Ex: 10"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Optionnel. Pour les couvertures avec rabats (volets pliés).
                Règle: 2×largeur + rabat ≤ 76 cm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Binding constraints info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Contraintes de reliure :</strong>
        </p>
        <ul className="text-sm text-amber-700 mt-2 space-y-1">
          <li>• <strong>Dos carré collé :</strong> minimum 40 pages intérieures</li>
          <li>• <strong>Piqûre (agrafes) :</strong> maximum 96 pages intérieures</li>
          <li>• Le nombre de pages doit toujours être un multiple de 4</li>
        </ul>
      </div>
    </div>
  )
}
