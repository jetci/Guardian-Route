import React from 'react';

export interface HandbookSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface HandbookContent {
  [key: string]: HandbookSection[];
}

// --- Content Definitions ---

const systemArchitecture: HandbookSection[] = [
  {
    id: 'arch_overview',
    title: 'System Architecture Overview',
    content: 'System Architecture Overview Placeholder',
  },
  {
    id: 'arch_auth',
    title: 'Authentication System',
    content: 'Authentication System Placeholder',
  },
];

const apiStructure: HandbookSection[] = [
  {
    id: 'api_naming',
    title: 'API Naming Standards',
    content: 'API Structure Placeholder',
  },
];

const exportFlow: HandbookSection[] = [
  {
    id: 'export_overview',
    title: 'Export Job Queue Overview',
    content: 'Export Job Queue Overview Placeholder',
  },
];

const devTools: HandbookSection[] = [
  {
    id: 'dev_tools_mock_role',
    title: 'Mock Role Switcher',
    content: 'Mock Role Switcher Placeholder',
  },
  {
    id: 'dev_tools_api_debug',
    title: 'API Debug Panel',
    content: 'API Debug Panel Placeholder',
  },
];

export const HANDBOOK_CONTENT: HandbookContent = {
  'system_architecture': systemArchitecture,
  'api_structure': apiStructure,
  'export_flow': exportFlow,
  'dev_tools': devTools,
  // Placeholder for future content
  'overlay_logic': [
    {
      id: 'overlay_logic_placeholder',
      title: 'Overlay Analysis Logic (Placeholder)',
    content: 'Overlay Analysis Logic Placeholder',
    },
  ],
};

export const HANDBOOK_TABS = [
  { id: 'system_architecture', title: 'Architecture' },
  { id: 'api_structure', title: 'API Structure' },
  { id: 'export_flow', title: 'Export Flow' },
  { id: 'overlay_logic', title: 'Overlay Logic' },
  { id: 'dev_tools', title: 'Dev Tools' },
];
