import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the user has our 'VIP Pass'
  const token = localStorage.getItem("access_token");

  // If no token, bounce them back to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, let them through to the 'Outlet' (the dashboard)
  return <Outlet />;
};

export default ProtectedRoute;