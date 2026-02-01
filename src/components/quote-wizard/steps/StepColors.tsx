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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Palette } from 'lucide-react'

interface StepColorsProps {
  printMode?: PrintMode
}

export function StepColors({ printMode }: StepColorsProps) {
  const { control } = useFormContext<QuoteFormData>()
  const coverPages = useWatch({ control, name: 'coverPages' })

  const hasCover = coverPages !== '0'
  const isOffset = printMode === 'offset'

  // Digital only has quadrichromie and noir
  // Offset has all options
  const colorOptions = isOffset
    ? (['quadrichromie', 'quadrichromie_vernis', 'bichromie', 'noir'] as const)
    : (['quadrichromie', 'noir'] as const)

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Sélectionnez les couleurs d&apos;impression pour l&apos;intérieur et la couverture.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interior colors */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-slate-600" />
            <h3 className="font-medium text-slate-900">Couleurs intérieures</h3>
          </div>

          <FormField
            control={control}
            name="interiorColors"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    className="flex flex-col space-y-3"
                  >
                    {colorOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`interior-${option}`} />
                        <Label htmlFor={`interior-${option}`} className="cursor-pointer flex items-center gap-2">
                          <ColorIndicator option={option} />
                          {FRENCH_LABELS.colors[option]}
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

        {/* Cover colors - only if has cover */}
        {hasCover && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Couleurs couverture</h3>
            </div>

            <FormField
              control={control}
              name="coverColors"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      className="flex flex-col space-y-3"
                    >
                      {colorOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-3">
                          <RadioGroupItem value={option} id={`cover-${option}`} />
                          <Label htmlFor={`cover-${option}`} className="cursor-pointer flex items-center gap-2">
                            <ColorIndicator option={option} />
                            {FRENCH_LABELS.colors[option]}
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
        )}
      </div>

      {/* Colors explanation */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
        <p><strong>Types d&apos;impression :</strong></p>
        <ul className="mt-2 space-y-1">
          <li>• <strong>Quadrichromie (CMJN) :</strong> impression couleur standard</li>
          {isOffset && (
            <li>• <strong>Quadrichromie + Vernis :</strong> protection et brillance supplémentaire</li>
          )}
          {isOffset && (
            <li>• <strong>Bichromie :</strong> deux couleurs (économique pour grands tirages)</li>
          )}
          <li>• <strong>Noir :</strong> impression monochrome (plus économique)</li>
        </ul>
      </div>
    </div>
  )
}

function ColorIndicator({ option }: { option: string }) {
  const colors: Record<string, string> = {
    quadrichromie: 'bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400',
    quadrichromie_vernis: 'bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400 ring-2 ring-white',
    bichromie: 'bg-gradient-to-r from-blue-500 to-red-500',
    noir: 'bg-slate-900',
  }

  return (
    <span className={`w-4 h-4 rounded-full ${colors[option] || 'bg-slate-300'}`} />
  )
}
