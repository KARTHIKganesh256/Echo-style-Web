import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAIStudioStore = create(
  persist(
    (set, get) => ({
      // User's style preferences history
      styleHistory: [],
      
      // Saved palette memories
      paletteMemories: [],
      
      // Virtual closet items
      closetItems: [],
      
      // Style DNA data
      styleDNA: null,
      
      // Add style preference
      addStylePreference: (preference) => set((state) => ({
        styleHistory: [...state.styleHistory, { ...preference, timestamp: Date.now() }]
      })),
      
      // Save palette memory
      savePaletteMemory: (memory) => set((state) => ({
        paletteMemories: [...state.paletteMemories, { ...memory, id: Date.now(), timestamp: Date.now() }]
      })),
      
      // Update palette memory
      updatePaletteMemory: (id, updates) => set((state) => ({
        paletteMemories: state.paletteMemories.map(memory => 
          memory.id === id ? { ...memory, ...updates } : memory
        )
      })),
      
      // Delete palette memory
      deletePaletteMemory: (id) => set((state) => ({
        paletteMemories: state.paletteMemories.filter(memory => memory.id !== id)
      })),
      
      // Add closet item
      addClosetItem: (item) => set((state) => ({
        closetItems: [...state.closetItems, { ...item, id: Date.now(), timestamp: Date.now() }]
      })),
      
      // Update closet item
      updateClosetItem: (id, updates) => set((state) => ({
        closetItems: state.closetItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      // Delete closet item
      deleteClosetItem: (id) => set((state) => ({
        closetItems: state.closetItems.filter(item => item.id !== id)
      })),
      
      // Calculate and update Style DNA
      updateStyleDNA: () => set((state) => {
        const { styleHistory } = state;
        if (styleHistory.length === 0) return {};
        
        const seasonCounts = {};
        styleHistory.forEach(pref => {
          if (pref.season) {
            seasonCounts[pref.season] = (seasonCounts[pref.season] || 0) + 1;
          }
        });
        
        const total = Object.values(seasonCounts).reduce((a, b) => a + b, 0);
        const percentages = {};
        
        Object.entries(seasonCounts).forEach(([season, count]) => {
          percentages[season] = Math.round((count / total) * 100);
        });
        
        // Find dominant traits
        const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
        const traits = sorted.map(([season, percent]) => ({ season, percent }));
        
        return {
          styleDNA: {
            traits,
            dominant: sorted[0]?.[0] || 'Spring',
            updated: Date.now()
          }
        };
      }),
      
      // Clear all data
      clearAll: () => set({
        styleHistory: [],
        paletteMemories: [],
        closetItems: [],
        styleDNA: null
      })
    }),
    {
      name: 'ai-studio-storage',
      version: 2,
      // Persist only lightweight data to avoid quota errors
      partialize: (state) => ({
        styleHistory: state.styleHistory.slice(-200),
        paletteMemories: state.paletteMemories.slice(-100),
        // Strip image data from persisted closet items; keep in-memory images
        closetItems: state.closetItems.slice(-50).map(({ image, ...rest }) => rest),
        styleDNA: state.styleDNA
      }),
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        // Ensure fields exist even if old state is cleared
        return {
          styleHistory: persistedState?.styleHistory || [],
          paletteMemories: persistedState?.paletteMemories || [],
          closetItems: (persistedState?.closetItems || []).map(ci => ({ ...ci, image: undefined })),
          styleDNA: persistedState?.styleDNA || null
        };
      }
    }
  )
);

export default useAIStudioStore;


