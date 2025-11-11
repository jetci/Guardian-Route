import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useIsDeveloper } from '../../context/RoleContext';

/**
 * Developer Handbook Component
 * 
 * Displays the developer handbook in a modal/drawer interface.
 * Loads markdown content and renders it with proper styling.
 * Only visible when user has DEVELOPER role.
 */
export const DeveloperHandbook: React.FC = () => {
  const isDeveloper = useIsDeveloper();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load handbook content when opened
  useEffect(() => {
    if (isOpen && !content) {
      loadHandbook();
    }
  }, [isOpen]);

  const loadHandbook = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/developer-handbook.md');
      
      if (!response.ok) {
        throw new Error(`Failed to load handbook: ${response.statusText}`);
      }

      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Failed to load developer handbook:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not a developer
  if (!isDeveloper) {
    return null;
  }

  return (
    <>
      {/* Handbook Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        title="Developer Handbook"
      >
        <span>📚</span>
        <span className="font-medium">Handbook</span>
      </button>

      {/* Handbook Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Developer Handbook
                    </h2>
                    <p className="text-sm text-blue-100">
                      Complete development guide for Guardian Route
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-white hover:bg-blue-700 rounded transition-colors"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <div className="mt-4 text-gray-600">Loading handbook...</div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="text-xl">❌</span>
                    <div>
                      <div className="font-semibold">Failed to load handbook</div>
                      <div className="text-sm mt-1">{error}</div>
                    </div>
                  </div>
                  <button
                    onClick={loadHandbook}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && content && (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom styling for markdown elements
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-500"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-2xl font-bold text-gray-800 mt-6 mb-3"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-xl font-semibold text-gray-700 mt-4 mb-2"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code
                            className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                          />
                        ) : (
                          <code
                            className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                            {...props}
                          />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-900 rounded-lg my-4" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-gray-700" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700"
                          {...props}
                        />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                          <table
                            className="min-w-full border border-gray-300 rounded-lg"
                            {...props}
                          />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-gray-100" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          className="border border-gray-300 px-4 py-2 text-gray-700"
                          {...props}
                        />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-6 border-gray-300" {...props} />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                📖 For internal development use only
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Close Handbook
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperHandbook;
