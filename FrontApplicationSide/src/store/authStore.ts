import { AuthStore } from "@/models/authStore";
import { create } from "zustand";

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    user: null,
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (value) => set({ user: value })
}))