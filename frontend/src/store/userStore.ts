import create from "zustand";

interface UserState {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  token: string;
  login: (userId: string, username: string, token: string) => void;
  logout: () => void;
}
const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  userId: "",
  username: "",
  token: "",
  login: (userId: string, username: string, token: string) => {
    localStorage.setItem("token", token);
    set((state) => ({
      ...state,
      isAuthenticated: true,
      userId,
      username,
      token,
    }));
  },
  logout: () => {
    localStorage.removeItem("token");
    set((state) => ({
      ...state,
      isAuthenticated: false,
      userId: "",
      username: "",
      token: "",
    }));
  },
}));

export default useUserStore;
