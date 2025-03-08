import { useEffect, useState } from "react";
import { UserRole } from "../app/Types/UserRoles";


const useAuth = (): UserRole | null => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return role;
};

export default useAuth;
