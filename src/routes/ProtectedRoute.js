import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Get authentication token
  const token = localStorage.getItem("dms_token");

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists → allow access to protected routes
  return <Outlet />;
};

export default ProtectedRoute;