import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/" />;
}

export default ProtectedRoute;