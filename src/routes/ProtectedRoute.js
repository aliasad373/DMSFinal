import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  /*
   * For initial development we allow access when no API token exists.
   * Change this to false after login API integration is complete.
   */
  const developmentMode = true;

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!developmentMode && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;