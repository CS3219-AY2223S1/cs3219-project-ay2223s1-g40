import create from "zustand";

const useUserStore = create((set) => ({
  isAuthenticated: false,
  userId: "",
  username: "",
  login: (userId, username) =>
    set((state) => ({ ...state, isAuthenticated: true, userId, username })),
  logout: () =>
    set((state) => ({ ...state, isAuthenticated: false, userId: "" })),
}));

export default useUserStore;
