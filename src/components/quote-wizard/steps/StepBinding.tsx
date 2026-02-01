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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface StepBindingProps {
  printMode?: PrintMode
}

export function StepBinding({ printMode }: StepBindingProps) {
  const { control } = useFormContext<QuoteFormData>()
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
    <div className="space-y-6">
      <p className="text-slate-600">
        Choisissez le type de reliure et les options de finition pour votre document.
      </p>

      {/* Binding type */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-4">Type de reliure</h3>
        
        <FormField
          control={control}
          name="bindingType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {bindingOptions.map((option) => (
                    <div key={option} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 transition-colors">
                      <RadioGroupItem value={option} id={`binding-${option}`} className="mt-0.5" />
                      <Label htmlFor={`binding-${option}`} className="cursor-pointer flex-1">
                        <span className="font-medium block">{FRENCH_LABELS.binding[option]}</span>
                        <span className="text-xs text-slate-500 block mt-1">
                          {getBindingDescription(option)}
                        </span>
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

      {/* Lamination - only if has cover */}
      {hasCover && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-4">Pelliculage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="laminationOrientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
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

            {hasLamination && (
              <FormField
                control={control}
                name="laminationFinish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
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
            )}
          </div>

          <p className="text-xs text-blue-700 mt-3">
            Le pelliculage protège la couverture et améliore son aspect visuel.
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p><strong>À savoir :</strong></p>
        <ul className="mt-2 space-y-1">
          <li>• <strong>Dos carré collé :</strong> aspect livre classique (min. 40 pages)</li>
          <li>• <strong>Dos carré collé PUR :</strong> colle plus résistante</li>
          {isOffset && <li>• <strong>Avec couture :</strong> solidité maximale pour usage intensif</li>}
          <li>• <strong>Piqûre :</strong> agrafes métalliques (max. 96 pages)</li>
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
