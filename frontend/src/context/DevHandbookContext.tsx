import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { HANDBOOK_TABS } from '../constants/devHandbookContent';
import type { HandbookSection } from '../constants/devHandbookContent';

// Define the context value interface
interface DevHandbookContextValue {
  isHandbookOpen: boolean;
  toggleHandbook: () => void;
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
  currentSection: HandbookSection | null;
  setCurrentSection: (section: HandbookSection | null) => void;
}

// Create the context
const DevHandbookContext = createContext<DevHandbookContextValue | undefined>(undefined);

/**
 * DevHandbook Provider component.
 * Manages the state of the Developer Handbook UI.
 */
export const DevHandbookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(HANDBOOK_TABS[0].id);
  const [currentSection, setCurrentSection] = useState<HandbookSection | null>(null);

  const toggleHandbook = useCallback(() => {
    setIsHandbookOpen((prev) => !prev);
    // Reset to initial state when closing
    if (isHandbookOpen) {
      setCurrentTab(HANDBOOK_TABS[0].id);
      setCurrentSection(null);
    }
  }, [isHandbookOpen]);

  const value = {
    isHandbookOpen,
    toggleHandbook,
    currentTab,
    setCurrentTab,
    currentSection,
    setCurrentSection,
  };

  return <DevHandbookContext.Provider value={value}>{children}</DevHandbookContext.Provider>;
};

/**
 * Custom hook to access the Developer Handbook context.
 */
export const useDevHandbook = (): DevHandbookContextValue => {
  const context = useContext(DevHandbookContext);
  if (context === undefined) {
    throw new Error('useDevHandbook must be used within a DevHandbookProvider');
  }
  return context;
};
