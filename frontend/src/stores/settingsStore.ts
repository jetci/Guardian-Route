import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchSettings, type Settings } from '../services/settingsService';

interface SettingsState {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateLocalSettings: (newSettings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            settings: null,
            loading: false,
            error: null,

            fetchSettings: async () => {
                // If already loading, skip
                if (get().loading) return;

                // If we have settings and they are less than 5 minutes old, maybe skip? 
                // For now, just simple caching: if we have settings, don't fetch unless forced?
                // Actually, let's just fetch but handle errors gracefully using existing cache

                set({ loading: true, error: null });
                try {
                    const data = await fetchSettings();
                    set({ settings: data, loading: false });
                } catch (error: any) {
                    console.error('Failed to fetch settings:', error);
                    // Keep existing settings if available, just update error
                    set({
                        loading: false,
                        error: error.response?.status === 429
                            ? 'Rate limit exceeded. Using cached settings.'
                            : 'Failed to load settings'
                    });
                }
            },

            updateLocalSettings: (newSettings) => {
                set((state) => ({
                    settings: state.settings ? { ...state.settings, ...newSettings } : null
                }));
            },
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({ settings: state.settings }), // Only persist settings data
        }
    )
);
