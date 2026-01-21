import { createContext, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "../interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("streetcats_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User): void => {
    setUser(userData);
    localStorage.setItem("streetcats_user", JSON.stringify(userData));
  }
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("streetcats_user");
  }


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};



export default AuthProvider;
