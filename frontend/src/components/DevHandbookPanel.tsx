import React, { useMemo } from 'react';
import { useDevHandbook } from '../context/DevHandbookContext';
import { useRole } from '../context/RoleContext';
import { HANDBOOK_CONTENT, HANDBOOK_TABS } from '../constants/devHandbookContent';
import type { HandbookSection } from '../constants/devHandbookContent';
import { BookOpen, X, ChevronLeft, Menu } from 'lucide-react';

// --- Helper Components ---

const HandbookContentDisplay: React.FC<{ section: HandbookSection }> = ({ section }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
        {section.title}
      </h2>
      <div className="text-gray-300 space-y-4">
        {section.content}
      </div>
    </div>
  );
};

const HandbookSidebar: React.FC<{
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
  setCurrentSection: (section: HandbookSection | null) => void;
}> = ({ currentTab, setCurrentTab, setCurrentSection }) => {
  return (
    <div className="w-64 bg-gray-800 flex-shrink-0 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-indigo-400">Sections</h3>
      </div>
      <nav className="space-y-1 p-2">
        {HANDBOOK_TABS.map((tab) => (
          <div key={tab.id}>
            <button
              onClick={() => {
                setCurrentTab(tab.id);
                setCurrentSection(null); // Reset section when changing tab
              }}
              className={`w-full text-left p-2 rounded-md transition-colors duration-150 flex items-center ${
                currentTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Menu className="w-4 h-4 mr-2" />
              {tab.title}
            </button>
            {currentTab === tab.id && (
              <ul className="ml-4 mt-1 space-y-1 border-l border-gray-600">
                {HANDBOOK_CONTENT[tab.id]?.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setCurrentSection(section)}
                      className="w-full text-left text-sm p-1 pl-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-150"
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// --- Main Component ---

const DevHandbookPanel: React.FC = () => {
  const { isDeveloper } = useRole();
  const {
    isHandbookOpen,
    toggleHandbook,
    currentTab,
    setCurrentTab,
    currentSection,
    setCurrentSection,
  } = useDevHandbook();

  // Do not render if not a developer
  if (!isDeveloper) {
    return null;
  }

  const currentContent = useMemo(() => {
    if (currentSection) {
      return currentSection;
    }
    // Default to the first section of the current tab if no specific section is selected
    const sections = HANDBOOK_CONTENT[currentTab];
    return sections && sections.length > 0 ? sections[0] : null;
  }, [currentTab, currentSection]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleHandbook}
        className={`fixed bottom-4 left-4 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isHandbookOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        title={isHandbookOpen ? 'Close Handbook' : 'Open Developer Handbook'}
      >
        <BookOpen className="w-6 h-6" />
      </button>

      {/* Handbook Panel Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-3/4 lg:w-2/3 bg-gray-900 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex ${
          isHandbookOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="absolute top-0 right-0 p-4 z-10">
          <button
            onClick={toggleHandbook}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Sidebar */}
        <HandbookSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setCurrentSection={setCurrentSection}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-indigo-400" />
              Developer Handbook
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              คู่มืออ้างอิงสำหรับโครงสร้างระบบและเครื่องมือพัฒนา
            </p>
          </div>
          {currentContent ? (
            <HandbookContentDisplay section={currentContent} />
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select a section from the sidebar to view content.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DevHandbookPanel;
