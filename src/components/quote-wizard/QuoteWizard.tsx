'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm, FormProvider, Path } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema, QuoteFormData } from '@/lib/schemas/quote-schema'
import { StepPrintMode } from './steps/StepPrintMode'
import { StepQuantityFormat } from './steps/StepQuantityFormat'
import { StepPages } from './steps/StepPages'
import { StepPaper } from './steps/StepPaper'
import { StepColors } from './steps/StepColors'
import { StepBinding } from './steps/StepBinding'
import { StepProductOptions } from './steps/StepProductOptions'
import { StepDelivery } from './steps/StepDelivery'
import { StepReview } from './steps/StepReview'
import { QuoteResultView, type QuoteResult } from './QuoteResultView'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Loader2,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react'

const TOTAL_STEPS = 9

import { useWizard } from '@/context/WizardContext';


export function QuoteWizard() {
  const { 
    currentStep, 
    setCurrentStep, 
    formDataRef, 
    draftId,
    setDraftId, 
    highestVisitedStep, 
    setHighestVisitedStep,
    clearStepReview,
    markLaterStepsForReview,
    resetWizard,
    setIsResultView
  } = useWizard();
  const searchParams = useSearchParams();
  const urlDraftId = searchParams.get('draft');
  const isInitialized = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(!!urlDraftId);

  // Sync isResultView with quoteResult presence
  useEffect(() => {
    setIsResultView(!!quoteResult);
  }, [quoteResult, setIsResultView]);


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
  });

  const { handleSubmit, watch, reset, trigger } = methods;
  const printMode = watch('printMode');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  // Load draft from URL parameter (database)
  const loadDraftFromDB = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`);
      const data = await res.json();
      if (data.success && data.quote) {
        const q = data.quote;
        reset({
          printMode: q.printMode,
          quantity: q.quantity,
          format: `${q.formatWidth}x${q.formatHeight}`,
          interiorPages: q.interiorPages,
          coverPages: String(q.coverPages) as '0' | '2' | '4',
          rabatWidth: q.rabatWidth || undefined,
          interiorPaperType: q.interiorPaperType,
          interiorGrammage: q.interiorGrammage,
          coverPaperType: q.coverPaperType || undefined,
          coverGrammage: q.coverGrammage || undefined,
          interiorColors: q.interiorColors,
          coverColors: q.coverColors || undefined,
          bindingType: q.bindingType,
          laminationOrientation: q.laminationOrientation || 'non',
          laminationFinish: q.laminationFinish || undefined,
          productType: q.productType || 'brochure',
          foldType: q.foldType || undefined,
          foldCount: q.foldCount || undefined,
          secondaryFoldType: q.secondaryFoldType || undefined,
          packagingType: q.packagingType || 'non',
          deliveries: q.deliveries || [{ quantity: 0, department: '', tailLift: false }],
        });
        // Restore the step user was on when they saved the draft
        if (q.currentStep && q.currentStep > 1) {
          setCurrentStep(q.currentStep);
          // Also restore highestVisitedStep so user can navigate to all visited steps
          setHighestVisitedStep(q.currentStep);
        }
        toast.success('Brouillon chargé', { description: 'Continuez votre devis.' });
      }
    } catch (e) {
      console.error('Failed to load draft', e);
      toast.error('Erreur', { description: 'Impossible de charger le brouillon.' });
    } finally {
      setIsLoadingDraft(false);
    }
  }, [reset, setCurrentStep, setHighestVisitedStep]);

  // Initialization: Load draft from URL OR reset for a clean start
  useEffect(() => {
    if (isInitialized.current) return;
    
    if (urlDraftId) {
      setDraftId(urlDraftId);
      loadDraftFromDB(urlDraftId);
    } else {
      // Direct visit to /new without draft -> Clear everything
      resetWizard();
      reset({
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
      });
      setIsLoadingDraft(false);
    }
    
    isInitialized.current = true;
  }, [urlDraftId, loadDraftFromDB, resetWizard, reset, setDraftId]);

  // Create an initial draft ID automatically for new quotes if not starting from one
  useEffect(() => {
    const createInitialDraft = async () => {
      // Only create if we are on step 1, don't have a draft ID yet, and not loading/submitting
      if (
        currentStep === 1 && 
        !urlDraftId && 
        !draftId && 
        !isLoadingDraft && 
        !isSubmitting && 
        !quoteResult &&
        isInitialized.current
      ) {
        try {
          const response = await fetch('/api/quotes/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentStep: 1 }),
          });
          const data = await response.json();
          if (data.success && data.draft?.id) {
            setDraftId(data.draft.id);
            // Replace URL silently to include the new draft ID
            if (typeof window !== 'undefined') {
              const newUrl = `${window.location.pathname}?draft=${data.draft.id}`;
              window.history.replaceState({ ...window.history.state }, '', newUrl);
            }
          }
        } catch (error) {
          console.warn('Initial draft creation failed:', error);
        }
      }
    };

    createInitialDraft();
  }, [currentStep, urlDraftId, draftId, isLoadingDraft, isSubmitting, quoteResult, setDraftId]);


  // Save draft on changes AND sync to context ref for header access
  useEffect(() => {
    const subscription = watch((value) => {
      // Sync to context ref for header to access
      formDataRef.current = value;
      
      localStorage.setItem('quote-wizard-draft', JSON.stringify({
        data: value,
        step: currentStep,
        _timestamp: Date.now()
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch, currentStep, formDataRef]);

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1: return ['printMode'];
      case 2: return ['quantity', 'format'];
      case 3: return ['interiorPages', 'coverPages', 'rabatWidth'];
      case 4: return ['interiorPaperType', 'interiorGrammage', 'coverPaperType', 'coverGrammage'];
      case 5: return ['interiorColors', 'coverColors'];
      case 6: return ['bindingType', 'laminationOrientation', 'laminationFinish'];
      case 7: return ['productType', 'foldType', 'foldCount', 'secondaryFoldType', 'packagingType'];
      case 8: return ['deliveries'];
      default: return [];
    }
  };

  // Validate current step fields whenever form values change
  useEffect(() => {
    const subscription = watch(() => {
      const validateCurrentStep = async () => {
        const fields = getFieldsForStep(currentStep);
        if (fields.length === 0) {
          setIsCurrentStepValid(true);
          return;
        }
        const isValid = await trigger(fields as Path<QuoteFormData>[], { shouldFocus: false });
        setIsCurrentStepValid(isValid);
      };
      validateCurrentStep();
    });
    
    // Initial validation
    const validateCurrentStep = async () => {
      const fields = getFieldsForStep(currentStep);
      if (fields.length === 0) {
        setIsCurrentStepValid(true);
        return;
      }
      const isValid = await trigger(fields as Path<QuoteFormData>[], { shouldFocus: false });
      setIsCurrentStepValid(isValid);
    };
    validateCurrentStep();
    
    return () => subscription.unsubscribe();
  }, [currentStep, trigger, watch]);

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields as Path<QuoteFormData>[]);
    
    if (isValid && currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Track highest visited step
      if (nextStep > highestVisitedStep) {
        setHighestVisitedStep(nextStep);
      }
      // Clear review status when arriving at a step
      clearStepReview(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step > currentStep && step <= highestVisitedStep) {
      // Allow clicking forward only to previously visited steps
      setCurrentStep(step);
      clearStepReview(step);
    }
  };

  // Track when form data changes and mark later steps for review
  const previousFormData = useRef<Record<string, unknown>>({});
  
  useEffect(() => {
    const subscription = watch((value) => {
      // Check if any important field changed
      const currentFields = getFieldsForStep(currentStep);
      let hasChanges = false;
      const valueRecord = value as Record<string, unknown>;
      
      for (const field of currentFields) {
        if (JSON.stringify(valueRecord[field]) !== JSON.stringify(previousFormData.current[field])) {
          hasChanges = true;
          break;
        }
      }
      
      if (hasChanges && highestVisitedStep > currentStep) {
        // Mark all later visited steps for review
        markLaterStepsForReview();
      }
      
      // Update previous form data
      previousFormData.current = { ...valueRecord };
    });
    return () => subscription.unsubscribe();
  }, [watch, currentStep, highestVisitedStep, markLaterStepsForReview]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setQuoteResult(result.quote);
      } else {
        console.error('Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors du calcul du devis:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (quoteResult?.id) {
      window.location.href = `/api/quotes/${quoteResult.id}/pdf`;
    }
  };

  const handleReset = () => {
    setQuoteResult(null);
    resetWizard();
    reset({
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
    });
    // Remove draft from URL silently
    const newUrl = window.location.pathname;
    window.history.replaceState({ ...window.history.state }, '', newUrl);
    // Force a re-initialization to trigger new draft creation
    isInitialized.current = false;
  };

  if (quoteResult) {
    return (
      <QuoteResultView 
        quoteResult={quoteResult} 
        onDownload={handleDownload} 
        onReset={handleReset}
        quantity={watch('quantity')}
      />
    );
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
      case 9: return <StepReview onEditStep={handleStepClick} />
      default: return null
    }
  };

  return (
    <div className="w-full">
      {/* Stepper area removed - now in DashboardHeader */}

      {/* Content Area - Clean Typeform-like layout */}
      <div className="px-6 md:px-12 pb-32 pt-8">
        <div className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {renderStep()}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Fixed Footer - Always at screen bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-xl border-t supports-[backdrop-filter]:bg-background/30 py-4 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="h-11 px-6 rounded-lg gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium hidden sm:block">
              Étape {currentStep} sur {TOTAL_STEPS}
            </span>
            
            {currentStep === TOTAL_STEPS ? (
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="h-11 px-8 rounded-lg font-bold bg-primary hover:bg-primary/90 gap-2 border-b-4 border-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calcul...
                  </>
                ) : (
                  <>
                    Calculer le devis
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || !isCurrentStepValid}
                className="h-11 px-8 rounded-lg font-bold gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

