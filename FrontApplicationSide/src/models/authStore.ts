export type AuthStore = {
    isAuthenticated: boolean;
    user: { userName: string } | null;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (value: { userName: string } | null) => void;
};