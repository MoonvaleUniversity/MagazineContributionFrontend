// components/AuthCheck.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MvRoutes from "../../app/MvRoutes";
import { getAuthToken, getUserData, checkAuthAndRedirect } from "../../services/AuthService";
;

export default function AuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const userData = getUserData();
    
    if (token && userData) {
      checkAuthAndRedirect(navigate);
    } else {
      navigate(MvRoutes.LOGIN);
    }
  }, [navigate]);

  return null; // Or a loading spinner
}