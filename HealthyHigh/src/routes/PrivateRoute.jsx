import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Check if user is logged in

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
