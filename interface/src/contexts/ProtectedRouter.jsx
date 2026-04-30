import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRouter({ children }) {
  const { user, loading } = useAuth(); 

  if (loading) return null; 


  if (!user || !user.id_user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isBlocked == 1) {
    return <Navigate to="/" replace />;
  }

  return children;
}
