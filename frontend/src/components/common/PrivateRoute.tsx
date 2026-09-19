import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../utils/authToken";
import { getRole } from "../../utils/authRole";
import { toast } from "react-hot-toast";

interface PrivateRouteProps {
  requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole }) => {
  const token = getToken();
  const role = getRole();

  if (!token || (requiredRole && role !== requiredRole)) {
    toast.error("unauthorized");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
