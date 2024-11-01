import {create} from 'zustand';

const useStore = create((set) => ({
    userdata: null,
    setUserdata: (username, email, id) => set({ userdata: { username, email, id } }),
}));

export default useStore;