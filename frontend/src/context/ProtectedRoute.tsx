import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth) { throw new Error("ProtectedRoute must be used inside AuthProvider") }

  const { user } = auth;

  if (!user) { return <Navigate to="/login" replace /> }

  return <>{children}</>
};

export default ProtectedRoute;
