import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  FullReportFormData,
  WizardState,
  StepValidation,
  initialFormData,
} from '../../types/full-report';

interface WizardContextType {
  state: WizardState;
  updateFormData: (data: Partial<FullReportFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  validateStep: (step: number) => Promise<boolean>;
  saveDraft: () => Promise<void>;
  submitReport: () => Promise<void>;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
};

interface WizardProviderProps {
  children: React.ReactNode;
  taskId: string;
  onSubmit: (data: FullReportFormData) => Promise<void>;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  taskId,
  onSubmit,
}) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    totalSteps: 10,
    formData: { ...initialFormData, taskId },
    validation: {},
    isDraft: false,
    lastSaved: null,
    isSubmitting: false,
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const draftKey = `wizard-draft-${taskId}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setState((prev) => ({
          ...prev,
          formData: parsedDraft.formData,
          currentStep: parsedDraft.currentStep || 1,
          isDraft: true,
          lastSaved: new Date(parsedDraft.lastSaved),
        }));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [taskId]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [state.formData]);

  const updateFormData = useCallback((data: Partial<FullReportFormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      // Validation logic will be implemented per step
      // For now, return true
      return true;
    },
    []
  );

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < prev.totalSteps) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep > 1) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, prev.totalSteps)),
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    const draftKey = `wizard-draft-${taskId}`;
    const draftData = {
      formData: state.formData,
      currentStep: state.currentStep,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
    setState((prev) => ({
      ...prev,
      isDraft: true,
      lastSaved: new Date(),
    }));
  }, [taskId, state.formData, state.currentStep]);

  const submitReport = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await onSubmit(state.formData);
      // Clear draft after successful submission
      const draftKey = `wizard-draft-${taskId}`;
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error('Failed to submit report:', error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [state.formData, onSubmit, taskId]);

  const resetWizard = useCallback(() => {
    setState({
      currentStep: 1,
      totalSteps: 10,
      formData: { ...initialFormData, taskId },
      validation: {},
      isDraft: false,
      lastSaved: null,
      isSubmitting: false,
    });
    const draftKey = `wizard-draft-${taskId}`;
    localStorage.removeItem(draftKey);
  }, [taskId]);

  const value: WizardContextType = {
    state,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    saveDraft,
    submitReport,
    resetWizard,
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};
