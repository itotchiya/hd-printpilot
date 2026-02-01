'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels: readonly string[]
  onStepClick?: (step: number) => void
}

export function WizardProgress({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Étape {currentStep} sur {totalSteps}</span>
          <span>{stepLabels[currentStep - 1]}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full step indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isClickable = stepNumber <= currentStep

            return (
              <div key={stepNumber} className="flex-1 flex items-center">
                {/* Step circle */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(stepNumber)}
                  disabled={!isClickable}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isCompleted && 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700',
                    isCurrent && 'bg-blue-600 text-white ring-4 ring-blue-200',
                    !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500',
                    isClickable && !isCurrent && 'cursor-pointer',
                    !isClickable && 'cursor-not-allowed'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </button>

                {/* Connector line */}
                {stepNumber < totalSteps && (
                  <div className="flex-1 h-0.5 mx-2">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        stepNumber < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Step labels */}
        <div className="flex justify-between mt-2">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1
            const isCurrent = stepNumber === currentStep

            return (
              <div
                key={stepNumber}
                className={cn(
                  'flex-1 text-center text-xs',
                  isCurrent ? 'text-blue-600 font-medium' : 'text-slate-500'
                )}
                style={{ maxWidth: `${100 / totalSteps}%` }}
              >
                <span className="line-clamp-2">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
