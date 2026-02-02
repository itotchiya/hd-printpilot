'use client'

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form'
import { QuoteFormData } from '@/lib/schemas/quote-schema'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Truck, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// French departments for delivery
const DEPARTMENTS = [
  { code: '01', name: 'Ain' },
  { code: '02', name: 'Aisne' },
  { code: '03', name: 'Allier' },
  { code: '04', name: 'Alpes-de-Haute-Provence' },
  { code: '05', name: 'Hautes-Alpes' },
  { code: '06', name: 'Alpes-Maritimes' },
  { code: '07', name: 'Ardèche' },
  { code: '08', name: 'Ardennes' },
  { code: '09', name: 'Ariège' },
  { code: '10', name: 'Aube' },
  { code: '11', name: 'Aude' },
  { code: '12', name: 'Aveyron' },
  { code: '13', name: 'Bouches-du-Rhône' },
  { code: '14', name: 'Calvados' },
  { code: '15', name: 'Cantal' },
  { code: '16', name: 'Charente' },
  { code: '17', name: 'Charente-Maritime' },
  { code: '18', name: 'Cher' },
  { code: '19', name: 'Corrèze' },
  { code: '21', name: "Côte-d'Or" },
  { code: '22', name: "Côtes-d'Armor" },
  { code: '23', name: 'Creuse' },
  { code: '24', name: 'Dordogne' },
  { code: '25', name: 'Doubs' },
  { code: '26', name: 'Drôme' },
  { code: '27', name: 'Eure' },
  { code: '28', name: 'Eure-et-Loir' },
  { code: '29', name: 'Finistère' },
  { code: '2A', name: 'Corse-du-Sud' },
  { code: '2B', name: 'Haute-Corse' },
  { code: '30', name: 'Gard' },
  { code: '31', name: 'Haute-Garonne' },
  { code: '32', name: 'Gers' },
  { code: '33', name: 'Gironde' },
  { code: '34', name: 'Hérault' },
  { code: '35', name: 'Ille-et-Vilaine' },
  { code: '36', name: 'Indre' },
  { code: '37', name: 'Indre-et-Loire' },
  { code: '38', name: 'Isère' },
  { code: '39', name: 'Jura' },
  { code: '40', name: 'Landes' },
  { code: '41', name: 'Loir-et-Cher' },
  { code: '42', name: 'Loire' },
  { code: '43', name: 'Haute-Loire' },
  { code: '44', name: 'Loire-Atlantique' },
  { code: '45', name: 'Loiret' },
  { code: '46', name: 'Lot' },
  { code: '47', name: 'Lot-et-Garonne' },
  { code: '48', name: 'Lozère' },
  { code: '49', name: 'Maine-et-Loire' },
  { code: '50', name: 'Manche' },
  { code: '51', name: 'Marne' },
  { code: '52', name: 'Haute-Marne' },
  { code: '53', name: 'Mayenne' },
  { code: '54', name: 'Meurthe-et-Moselle' },
  { code: '55', name: 'Meuse' },
  { code: '56', name: 'Morbihan' },
  { code: '57', name: 'Moselle' },
  { code: '58', name: 'Nièvre' },
  { code: '59', name: 'Nord' },
  { code: '60', name: 'Oise' },
  { code: '61', name: 'Orne' },
  { code: '62', name: 'Pas-de-Calais' },
  { code: '63', name: 'Puy-de-Dôme' },
  { code: '64', name: 'Pyrénées-Atlantiques' },
  { code: '65', name: 'Hautes-Pyrénées' },
  { code: '66', name: 'Pyrénées-Orientales' },
  { code: '67', name: 'Bas-Rhin' },
  { code: '68', name: 'Haut-Rhin' },
  { code: '69', name: 'Rhône' },
  { code: '70', name: 'Haute-Saône' },
  { code: '71', name: 'Saône-et-Loire' },
  { code: '72', name: 'Sarthe' },
  { code: '73', name: 'Savoie' },
  { code: '74', name: 'Haute-Savoie' },
  { code: '75', name: 'Paris' },
  { code: '76', name: 'Seine-Maritime' },
  { code: '77', name: 'Seine-et-Marne' },
  { code: '78', name: 'Yvelines' },
  { code: '79', name: 'Deux-Sèvres' },
  { code: '80', name: 'Somme' },
  { code: '81', name: 'Tarn' },
  { code: '82', name: 'Tarn-et-Garonne' },
  { code: '83', name: 'Var' },
  { code: '84', name: 'Vaucluse' },
  { code: '85', name: 'Vendée' },
  { code: '86', name: 'Vienne' },
  { code: '87', name: 'Haute-Vienne' },
  { code: '88', name: 'Vosges' },
  { code: '89', name: 'Yonne' },
  { code: '90', name: 'Territoire de Belfort' },
  { code: '91', name: 'Essonne' },
  { code: '92', name: 'Hauts-de-Seine' },
  { code: '93', name: 'Seine-Saint-Denis' },
  { code: '94', name: 'Val-de-Marne' },
  { code: '95', name: "Val-d'Oise" },
  { code: '971', name: 'Guadeloupe' },
  { code: '972', name: 'Martinique' },
  { code: '973', name: 'Guyane' },
  { code: '974', name: 'La Réunion' },
  { code: '976', name: 'Mayotte' },
]

export function StepDelivery() {
  const { control, setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliveries',
  })
  const totalQuantity = useWatch({ control, name: 'quantity' }) || 0
  const deliveries = useWatch({ control, name: 'deliveries' }) || []

  const usedQuantity = deliveries.reduce((sum, d) => sum + (d.quantity || 0), 0)
  const remainingQuantity = totalQuantity - usedQuantity
  const isBalanced = usedQuantity === totalQuantity

  const addDelivery = () => {
    append({
      quantity: remainingQuantity > 0 ? remainingQuantity : 0,
      department: '',
      tailLift: false,
    })
  }

  const solderOnLast = () => {
    if (fields.length > 0) {
      const lastIndex = fields.length - 1
      const currentVal = deliveries[lastIndex]?.quantity || 0
      setValue(`deliveries.${lastIndex}.quantity`, currentVal + remainingQuantity)
    } else {
      addDelivery()
    }
  }

  return (
    <div className="space-y-10">
      <p className="text-muted-foreground text-base">
        Répartissez les exemplaires entre les différentes destinations de livraison.
      </p>

      {/* Quantity balance indicator - Warning Orange Style */}
      <div className={cn(
        "border border-dashed rounded-lg p-6 transition-colors",
        "bg-amber-500/5 border-amber-500/50"
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Balance des quantités :</span>
              <span className={cn(
                "text-lg font-bold",
                isBalanced ? "text-green-600 dark:text-green-500" : "text-amber-600 dark:text-amber-500"
              )}>
                {usedQuantity} / {totalQuantity} ex.
              </span>
            </div>
            {!isBalanced && (
              <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm font-medium">
                  {remainingQuantity > 0 
                    ? `Il reste ${remainingQuantity} exemplaires à répartir`
                    : `Trop d'exemplaires répartis (excédent de ${Math.abs(remainingQuantity)})`
                  }
                </p>
              </div>
            )}
          </div>
          
          {!isBalanced && (
            <Button 
              type="button" 
              variant="default"
              size="sm" 
              onClick={solderOnLast}
              className="bg-amber-500 hover:bg-amber-600 text-white border-none"
            >
              {remainingQuantity > 0 ? 'Solder le reste' : 'Ajuster le total'}
            </Button>
          )}
          {isBalanced && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-500 text-sm font-medium px-3 py-1 bg-green-500/10 rounded-full">
              <Check className="w-4 h-4" />
              Répartition correcte
            </div>
          )}
        </div>
      </div>

      {errors.deliveries?.root && (
        <p className="text-sm text-destructive font-medium border border-destructive/20 bg-destructive/5 p-3 rounded-lg">
          {errors.deliveries.root.message}
        </p>
      )}

      {/* Destinations Section - Wrapped in single dashed container */}
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 bg-muted/20 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-lg">Destinations</h3>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={addDelivery}
            className="gap-2 shadow-none"
          >
            <Plus className="w-4 h-4" />
            Ajouter une destination
          </Button>
        </div>

        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-6 relative group">
              {index > 0 && <div className="border-t border-dashed border-muted-foreground/20 my-6" />}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground text-base">Destination {index + 1}</span>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Quantity */}
                <FormField
                  control={control}
                  name={`deliveries.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Quantité</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="h-11 w-full bg-background shadow-none"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department */}
                <FormField
                  control={control}
                  name={`deliveries.${index}.department`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Département</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full bg-background shadow-none">
                            <SelectValue placeholder="Sélectionner un département..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shadow-none border-border">
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.code} value={dept.code}>
                              <span className="font-medium mr-2">{dept.code}</span>
                              <span className="text-muted-foreground">{dept.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tail Lift - Full Clickable Card */}
                <FormField
                  control={control}
                  name={`deliveries.${index}.tailLift`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className={cn(
                            "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 bg-background hover:border-primary/50",
                            field.value ? "border-primary bg-primary/5" : "border-input"
                          )}
                          onClick={() => field.onChange(!field.value)}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                            field.value ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-transparent"
                          )}>
                            {field.value && <Check className="w-3.5 h-3.5" />}
                          </div>
                          
                          <div className="space-y-1">
                            <span className="font-medium text-sm text-foreground block">
                              Hayon élévateur (+60€)
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              Indispensable si le destinataire ne dispose pas de quai de déchargement
                            </span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logistics Info Footer - Soft Gray */}
      <div className="bg-muted/50 border border-border/50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-background rounded-full border shadow-sm">
            <Truck className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Logistique et Livraison</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
              <li>Le tarif est calculé dynamiquement selon le département et le poids total de la commande.</li>
              <li>Le hayon élévateur est indispensable si le destinataire ne dispose pas d&apos;un quai de déchargement.</li>
              <li>Toutes les livraisons sont effectuées par transporteur spécialisé avec suivi en temps réel.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
