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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export function StepProductOptions() {
  const { control } = useFormContext<QuoteFormData>()
  const productType = useWatch({ control, name: 'productType' })
  const foldType = useWatch({ control, name: 'foldType' })

  const isDepliant = productType === 'depliant'
  const hasFold = isDepliant && foldType && foldType !== 'rien'

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Définissez le type de produit et les options de pliage si applicable.
      </p>

      {/* Product type */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-4">Type de produit</h3>
        
        <FormField
          control={control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {(['brochure', 'flyer_poster', 'carte_visite', 'depliant'] as const).map((option) => (
                    <div key={option}>
                      <RadioGroupItem
                        value={option}
                        id={`product-${option}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`product-${option}`}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-blue-400 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all"
                      >
                        <span className="text-2xl mb-2">{getProductIcon(option)}</span>
                        <span className="font-medium text-sm text-center">
                          {FRENCH_LABELS.productType[option]}
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

      {/* Fold options - only for depliant */}
      {isDepliant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-4">Options de pliage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="foldType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de pli</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['rien', 'roule', 'accordeon', 'croise'] as const).map((option) => (
                        <SelectItem key={option} value={option}>
                          {FRENCH_LABELS.foldType[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasFold && (
              <>
                <FormField
                  control={control}
                  name="foldCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de plis</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={6}
                          placeholder="Ex: 2"
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
                      <FormLabel>Pliage secondaire</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Optionnel..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(['rien', 'croise'] as const).map((option) => (
                            <SelectItem key={option} value={option}>
                              {FRENCH_LABELS.foldType[option]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Packaging */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-4">Conditionnement</h3>
        
        <FormField
          control={control}
          name="packagingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d&apos;emballage</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(['non', 'a_lunite', 'par_paquet', 'par_2', 'par_3', 'par_4', 'par_5_10'] as const).map((option) => (
                    <SelectItem key={option} value={option}>
                      {FRENCH_LABELS.packaging[option]}
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
  )
}

function getProductIcon(option: string): string {
  const icons: Record<string, string> = {
    brochure: '📖',
    flyer_poster: '📄',
    carte_visite: '💼',
    depliant: '📰',
  }
  return icons[option] || '📋'
}
