import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import axios from 'axios';
import { serverurl } from '../firebaseConfig';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      communityId: null,
      projectId: null,
      currency: null,

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
      setCurrency: (currency) => set({currency: currency}),
      clearCurrency: () => set({currency: null}),
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

export const useFeedsStore = create((set) => ({
  feeds: [],
  isLoading: false,
  
  fetchFeeds: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${serverurl}/issues/filter/condition?status=OPEN&status=IN_PROGRESS`);
      set({ feeds: response.data });
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useMyIssuesStore = create((set) => ({
  myIssues: [],
  isLoading: false,
  
  fetchMyIssues: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${serverurl}/issues/user/${userId}`);
      set({ myIssues: response.data });
    } catch (error) {
      console.error('Error fetching my issues:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  removeIssueById: (issueId) => {
    set((state) => ({
      myIssues: state.myIssues.filter(issue => issue.id !== issueId),
    }));
  },
  
}));

// Store for SolvedIssues
export const useSolvedIssuesStore = create((set) => ({
  solvedIssues: [],
  isLoading: false,
  
  fetchSolvedIssues: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${serverurl}/issues/filter/condition?status=CLOSED&status=RESOLVED`);
      set({ solvedIssues: response.data });
    } catch (error) {
      console.error('Error fetching solved issues:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));