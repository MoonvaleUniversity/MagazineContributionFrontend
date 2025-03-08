import { useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";
import { UserRole } from "../app/Types/UserRoles";

interface ProtectedRouteProps {
  roles: UserRole[]; // Allowed roles
  children: JSX.Element; // Component to render if authorized
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const navigate = useNavigate();

  // Retrieve user data and safely parse it
  const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  const userRole = parsedUserData?.role || ""; 

  useEffect(() => {
    // Redirect if no token or invalid role
    if (!token) {
      navigate("/", { replace: true });
    } else if (roles && !roles.some(role => role === userRole)) {
      navigate("/not-authorized", { replace: true });
    }
  }, [token, userRole, navigate, roles]);

  // If not authorized, don't render the protected component
  if (!token || !roles.some(role => role === userRole)) {
    return null;
  }

  return children; // Render the protected route if authorized
};

export default ProtectedRoute;
