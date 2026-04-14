import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <div>Loading...</div>;
  }

  return user ? (
    children ?? <Outlet />
  ) : (
    <Navigate
      to={`/?auth=login&redirect=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
}
