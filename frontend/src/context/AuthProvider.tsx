import { createContext, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "../interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("streetcats_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("streetcats_token");
  });

  const login = (userData: User, authToken: string): void => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("streetcats_user", JSON.stringify(userData));
    localStorage.setItem("streetcats_token", authToken);
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("streetcats_user");
    localStorage.removeItem("streetcats_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
