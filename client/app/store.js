import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      communityId: null,
      projectId: null,

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      setProfileUrl: (url) => set((state) => ({
        user: state.user ? { ...state.user, profileUrl: url } : null
      })),

      setCommunityId: (id) => set({ communityId: id }),
      clearCommunityId: () => set({ communityId: null }),
      setProjectId: (id) => set({ projectId: id }),
      clearProjectId: () => set({ projectId: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        communityId: state.communityId,
        projectId: state.projectId,
      }),
    }
  )
);

export { useAuthStore };