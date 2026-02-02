'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { QuoteFormData, INTERIOR_PAPER_TYPES, COVER_PAPER_TYPES, PrintMode } from '@/lib/schemas/quote-schema'
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
import { cn } from '@/lib/utils'

interface StepPaperProps {
  printMode?: PrintMode
}

// Grammages by paper type (from Excel workbook)
const GRAMMAGES: Record<string, number[]> = {
  'Couché Mat': [90, 115, 135, 150, 170, 200, 250, 300, 350, 400],
  'Couché Satin': [90, 115, 135, 150, 170, 200, 250, 300, 350, 400],
  'Brillant': [90, 115, 135, 150, 170, 200, 250, 300, 350, 400],
  'Offset': [80, 90, 100, 120, 140, 160, 170, 190, 220, 250, 300],
  'Recyclé': [80, 90, 100, 120, 140, 170, 200, 250, 300],
  'Bouffant Blanc': [80, 90, 100, 115, 120, 140, 150, 170],
  'Bouffant Munken Blanc': [80, 90, 100, 115, 120, 150, 170, 240, 300],
  'Bouffant Munken Crème': [80, 90, 100, 115, 120, 150, 170, 240, 300],
  'Bouffant': [80, 90, 100, 115, 120, 140, 150, 170],
  'Carte 1 face': [250, 300, 350, 400],
  'Autre': [80, 90, 100, 115, 120, 135, 150, 170, 200, 250, 300, 350, 400],
}

export function StepPaper({ printMode }: StepPaperProps) {
  const { control, setValue } = useFormContext<QuoteFormData>()
  const coverPages = useWatch({ control, name: 'coverPages' })
  const interiorPaperType = useWatch({ control, name: 'interiorPaperType' })
  const coverPaperType = useWatch({ control, name: 'coverPaperType' })

  const hasCover = coverPages !== '0'
  const isOffset = printMode === 'offset'

  // Get available paper types
  const interiorPaperTypes = INTERIOR_PAPER_TYPES.filter(type => {
    // 'Bouffant' is only available for offset
    if (type === 'Bouffant' && !isOffset) return false
    return true
  })

  const getGrammages = (paperType: string): number[] => {
    return GRAMMAGES[paperType] || GRAMMAGES['Autre']
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <p className="text-muted-foreground text-base">
        Sélectionnez le type de papier et le grammage pour l&apos;intérieur et la couverture.
      </p>

      {/* Section: Interior Paper */}
      <div className="border border-dashed border-primary/30 rounded-lg p-6 space-y-6 bg-muted/20">
        <h3 className="font-semibold text-foreground text-base">Papier intérieur</h3>
        
        {/* Type de papier */}
        <FormField
          control={control}
          name="interiorPaperType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Type de papier</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value)
                  // Reset grammage when paper type changes
                  setValue('interiorGrammage', undefined as unknown as number)
                }} 
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {interiorPaperTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grammage */}
        <FormField
          control={control}
          name="interiorGrammage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Grammage (g/m²)</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString() || ''}
                disabled={!interiorPaperType}
              >
                <FormControl>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={interiorPaperType ? "Sélectionner..." : "Choisir d'abord le type"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {interiorPaperType && getGrammages(interiorPaperType).map((grammage) => (
                    <SelectItem key={grammage} value={grammage.toString()}>
                      {grammage} g/m²
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section: Cover Paper (only if has cover) */}
      {hasCover && (
        <div className="border border-dashed border-primary/30 rounded-lg p-6 space-y-6 bg-muted/20">
          <h3 className="font-semibold text-foreground text-base">Papier couverture</h3>
          
          {/* Type de papier */}
          <FormField
            control={control}
            name="coverPaperType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Type de papier</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value)
                    setValue('coverGrammage', undefined as unknown as number)
                  }} 
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COVER_PAPER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grammage */}
          <FormField
            control={control}
            name="coverGrammage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Grammage (g/m²)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString() || ''}
                  disabled={!coverPaperType}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder={coverPaperType ? "Sélectionner..." : "Choisir d'abord le type"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coverPaperType && getGrammages(coverPaperType).map((grammage) => (
                      <SelectItem key={grammage} value={grammage.toString()}>
                        {grammage} g/m²
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Section: Paper Tips (Dashed Orange Alert) */}
      <div className="border border-dashed border-amber-500/50 rounded-lg p-5 bg-amber-500/5">
        <p className="font-semibold text-foreground text-sm mb-3">Conseils papier :</p>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Couché Mat/Satin :</strong> idéal pour photos et graphiques</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Offset :</strong> parfait pour texte et écriture</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Bouffant :</strong> aspect naturel, agréable au toucher</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Couverture :</strong> privilégier 250g+ pour la rigidité</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
