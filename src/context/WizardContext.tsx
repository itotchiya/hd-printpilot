"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

interface WizardContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formDataRef: React.MutableRefObject<FormData>;
  draftId: string | null;
  setDraftId: React.Dispatch<React.SetStateAction<string | null>>;
  // New: Track highest step user has visited
  highestVisitedStep: number;
  setHighestVisitedStep: React.Dispatch<React.SetStateAction<number>>;
  // New: Track steps that need review (due to changes in earlier steps)
  stepsNeedingReview: Set<number>;
  markStepForReview: (step: number) => void;
  clearStepReview: (step: number) => void;
  clearAllReviews: () => void;
  // New: Mark steps after current as needing review when data changes
  markLaterStepsForReview: () => void;
  // New: Track if we are in the result view
  isResultView: boolean;
  setIsResultView: React.Dispatch<React.SetStateAction<boolean>>;
  // New: Reset wizard to initial state for new quote
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const formDataRef = useRef<FormData>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [highestVisitedStep, setHighestVisitedStep] = useState(1);
  const [stepsNeedingReview, setStepsNeedingReview] = useState<Set<number>>(new Set());
  const [isResultView, setIsResultView] = useState(false);
  const totalSteps = 9;

  const markStepForReview = useCallback((step: number) => {
    setStepsNeedingReview(prev => new Set(prev).add(step));
  }, []);

  const clearStepReview = useCallback((step: number) => {
    setStepsNeedingReview(prev => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  }, []);

  const clearAllReviews = useCallback(() => {
    setStepsNeedingReview(new Set());
  }, []);

  // Mark all steps after the current step as needing review
  const markLaterStepsForReview = useCallback(() => {
    setStepsNeedingReview(prev => {
      const newSet = new Set(prev);
      for (let i = currentStep + 1; i <= highestVisitedStep; i++) {
        newSet.add(i);
      }
      return newSet;
    });
  }, [currentStep, highestVisitedStep]);

  // Reset wizard to initial state for new quote
  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
    formDataRef.current = {};
    setDraftId(null);
    setHighestVisitedStep(1);
    setStepsNeedingReview(new Set());
    setIsResultView(false);
    // Clear localStorage draft
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quote-wizard-draft');
    }
  }, []);

  return (
    <WizardContext.Provider value={{ 
      currentStep, 
      setCurrentStep, 
      totalSteps, 
      formData, 
      setFormData, 
      formDataRef, 
      draftId, 
      setDraftId,
      highestVisitedStep,
      setHighestVisitedStep,
      stepsNeedingReview,
      markStepForReview,
      clearStepReview,
      clearAllReviews,
      markLaterStepsForReview,
      resetWizard,
      isResultView,
      setIsResultView
    }}>
      {children}
    </WizardContext.Provider>
  );
}


export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
