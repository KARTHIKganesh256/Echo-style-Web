import { create } from 'zustand';

const useSeasonStore = create((set) => ({
  currentSeason: 'Neutral',
  seasonData: null,
  
  setSeason: (season, data) => set({ 
    currentSeason: season, 
    seasonData: data 
  }),
  
  clearSeason: () => set({ 
    currentSeason: 'Neutral', 
    seasonData: null 
  }),
}));

export default useSeasonStore;
