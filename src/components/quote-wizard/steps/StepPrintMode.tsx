'use client'

import { useFormContext } from 'react-hook-form'
import { QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Printer, Factory } from 'lucide-react'

export function StepPrintMode() {
  const { control } = useFormContext<QuoteFormData>()

  return (
    <div className="space-y-6">
      <p className="text-slate-600">
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Digital option */}
                <div>
                  <RadioGroupItem
                    value="digital"
                    id="digital"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="digital"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-6 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all"
                  >
                    <Printer className="w-12 h-12 text-blue-600 mb-4" />
                    <span className="text-lg font-semibold">
                      {FRENCH_LABELS.printMode.digital}
                    </span>
                    <span className="text-sm text-slate-500 text-center mt-2">
                      Idéal pour les petits tirages (1-500 exemplaires)
                    </span>
                    <ul className="text-xs text-slate-400 mt-3 space-y-1">
                      <li>✓ Délai rapide</li>
                      <li>✓ Pas de frais de calage</li>
                      <li>✓ Personnalisation possible</li>
                    </ul>
                  </Label>
                </div>

                {/* Offset option */}
                <div>
                  <RadioGroupItem
                    value="offset"
                    id="offset"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="offset"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-6 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all"
                  >
                    <Factory className="w-12 h-12 text-orange-600 mb-4" />
                    <span className="text-lg font-semibold">
                      {FRENCH_LABELS.printMode.offset}
                    </span>
                    <span className="text-sm text-slate-500 text-center mt-2">
                      Économique pour les grands tirages (500+ exemplaires)
                    </span>
                    <ul className="text-xs text-slate-400 mt-3 space-y-1">
                      <li>✓ Coût unitaire réduit</li>
                      <li>✓ Qualité professionnelle</li>
                      <li>✓ Large choix de finitions</li>
                    </ul>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>Conseil :</strong> Pour les quantités supérieures à 300 exemplaires, 
          nous comparerons automatiquement les prix numérique et offset pour vous 
          proposer la solution la plus économique.
        </p>
      </div>
    </div>
  )
}
