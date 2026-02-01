'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema, QuoteFormData, FRENCH_LABELS } from '@/lib/schemas/quote-schema'
import { WizardProgress } from './WizardProgress'
import { WizardNavigation } from './WizardNavigation'
import { StepPrintMode } from './steps/StepPrintMode'
import { StepQuantityFormat } from './steps/StepQuantityFormat'
import { StepPages } from './steps/StepPages'
import { StepPaper } from './steps/StepPaper'
import { StepColors } from './steps/StepColors'
import { StepBinding } from './steps/StepBinding'
import { StepProductOptions } from './steps/StepProductOptions'
import { StepDelivery } from './steps/StepDelivery'
import { StepReview } from './steps/StepReview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, FileText, LayoutDashboard, Download, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TOTAL_STEPS = 9

export function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quoteResult, setQuoteResult] = useState<any>(null)

  const methods = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: 'onChange',
    defaultValues: {
      printMode: undefined as unknown as 'digital' | 'offset',
      quantity: undefined as unknown as number,
      format: '',
      interiorPages: undefined as unknown as number,
      coverPages: '0',
      interiorPaperType: '',
      interiorGrammage: undefined as unknown as number,
      interiorColors: undefined as unknown as 'quadrichromie',
      bindingType: 'rien',
      laminationOrientation: 'non',
      productType: 'brochure',
      packagingType: 'non',
      deliveries: [{ quantity: 0, department: '', tailLift: false }],
    },
  })

  const { handleSubmit, trigger, watch, reset } = methods
  const printMode = watch('printMode')

  // Step validation schemas mapping
  const stepValidationFields: Record<number, (keyof QuoteFormData)[]> = {
    1: ['printMode'],
    2: ['quantity', 'format'],
    3: ['interiorPages', 'coverPages'],
    4: ['interiorPaperType', 'interiorGrammage'],
    5: ['interiorColors'],
    6: ['bindingType', 'laminationOrientation'],
    7: ['productType', 'packagingType'],
    8: ['deliveries'],
    9: [], // Review step
  }

  const handleNext = async () => {
    const fieldsToValidate = stepValidationFields[currentStep]
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = async (step: number) => {
    if (quoteResult) return;

    if (step < currentStep) {
      setCurrentStep(step)
      return
    }
    
    let canProceed = true
    for (let i = currentStep; i < step; i++) {
      const isValid = await trigger(stepValidationFields[i])
      if (!isValid) {
        canProceed = false
        setCurrentStep(i)
        break
      }
    }
    
    if (canProceed) {
      setCurrentStep(step)
    }
  }

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setQuoteResult(result.quote)
      } else {
        console.error('Erreur:', result.error)
      }
    } catch (error) {
      console.error('Erreur lors du calcul du devis:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (quoteResult?.id) {
      window.location.href = `/api/quotes/${quoteResult.id}/pdf`;
    }
  };

  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

  if (quoteResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in zoom-in-95 duration-500">
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-primary/10">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Devis Calculé avec Succès</h2>
              <p className="text-slate-600 mt-2">Référence: QT-{quoteResult.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Main Price */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total HT</h3>
                  <div className="text-5xl font-black text-primary">{formatEuro(quoteResult.totalPrice)}</div>
                  <p className="text-slate-500 mt-2">Soit {formatEuro(quoteResult.pricePerUnit)} par exemplaire</p>
                </div>
                
                <div className="pt-6 border-t space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Mode d'impression</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {quoteResult.selectedMode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Poids total estimé</span>
                    <span className="font-semibold">{quoteResult.totalWeight} kg</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-primary" /> Détail du prix
                </h3>
                <div className="space-y-2 text-sm">
                  <BreakdownRow label="Papier" value={quoteResult.breakdown.paperCost} />
                  <BreakdownRow label="Impression & Setup" value={quoteResult.breakdown.printingCost} />
                  <BreakdownRow label="Façonnage" value={quoteResult.breakdown.bindingCost} />
                  {quoteResult.breakdown.laminationCost > 0 && <BreakdownRow label="Pelliculage" value={quoteResult.breakdown.laminationCost} />}
                  <BreakdownRow label="Livraison" value={quoteResult.breakdown.deliveryCost} />
                  <div className="pt-2 border-t mt-2 flex justify-between font-bold text-slate-900">
                    <span>Sous-total HT</span>
                    <span>{formatEuro(quoteResult.breakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground italic">
                    <span>Marge ({quoteResult.breakdown.marginRate})</span>
                    <span>{formatEuro(quoteResult.breakdown.marginAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center border-t pt-8">
              <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Accéder au Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8" onClick={() => { setQuoteResult(null); setCurrentStep(1); reset(); }}>
                Créer un autre devis
              </Button>
              <Button variant="ghost" size="lg" onClick={handleDownload} className="w-full sm:w-auto text-primary">
                <Download className="mr-2 h-4 w-4" /> Télécharger PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepPrintMode />
      case 2: return <StepQuantityFormat />
      case 3: return <StepPages printMode={printMode} />
      case 4: return <StepPaper printMode={printMode} />
      case 5: return <StepColors printMode={printMode} />
      case 6: return <StepBinding printMode={printMode} />
      case 7: return <StepProductOptions />
      case 8: return <StepDelivery />
      case 9: return <StepReview />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Havet <span className="text-primary">PrintPilot</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-lg mx-auto">
            Configurez votre projet en quelques étapes pour obtenir un devis instantané.
          </p>
        </div>

        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS}
          stepLabels={FRENCH_LABELS.steps}
          onStepClick={handleStepClick}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mt-8 shadow-lg border-primary/5">
              <CardHeader className="border-b bg-muted/5 py-4">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span>Étape {currentStep}: {FRENCH_LABELS.steps[currentStep - 1]}</span>
                  <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
                    {currentStep} / {TOTAL_STEPS}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {renderStep()}
              </CardContent>
            </Card>

            <WizardNavigation
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-800">{formatEuro(value)}</span>
    </div>
  );
}
