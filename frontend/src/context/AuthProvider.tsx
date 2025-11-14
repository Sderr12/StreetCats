import { createContext, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "../interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User): void => setUser(userData);
  const logout = (): void => setUser(null);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};
