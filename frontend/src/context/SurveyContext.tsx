import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { INITIAL_SURVEY_DATA } from '../types/survey';
import type { SurveyData } from '../types/survey';

interface SurveyContextType {
    data: SurveyData;
    updateData: (updates: Partial<SurveyData>) => void;
    resetData: () => void;
    currentStep: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    isStepValid: (step: number) => boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<SurveyData>(INITIAL_SURVEY_DATA);
    const [currentStep, setCurrentStep] = useState(1);

    const updateData = (updates: Partial<SurveyData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(INITIAL_SURVEY_DATA);
        setCurrentStep(1);
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 8));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const setStep = (step: number) => setCurrentStep(step);

    // Basic validation placeholder - can be expanded per step
    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1: // Incident Info
                return !!data.villageId && !!data.disasterType && !!data.surveyDate;
            default:
                return true;
        }
    };

    return (
        <SurveyContext.Provider
            value={{
                data,
                updateData,
                resetData,
                currentStep,
                setStep,
                nextStep,
                prevStep,
                isStepValid,
            }}
        >
            {children}
        </SurveyContext.Provider>
    );
};

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within a SurveyProvider');
    }
    return context;
};
