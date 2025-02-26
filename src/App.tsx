import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/MvAuth/MvLogin";
import Dashboard from "./pages/MvDashboard/MvDashboard";
import MvRoutes from "./app/MvRoutes";
import MvEmailVerify from "./pages/MvAuth/MvEmailVerify";
import MvNotFound from "./pages/Not Found/MvNotFound";

// Assuming you're using some auth check to decide whether to navigate to dashboard
let isAuthenticated = true; // Example, should be set based on actual auth state

function App() {
  const token = localStorage.getItem("token");
  if (token) {
    isAuthenticated = true;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.EMAIL_VERIFY} element={<MvEmailVerify />} />
        <Route path={MvRoutes.NOTFOUND} element={<MvNotFound />} />
        
        {/* Conditionally redirect based on authentication */}
        <Route
          path={MvRoutes.DASHBOARD}
          element={isAuthenticated ? <Dashboard /> : <Navigate to={MvRoutes.LOGIN} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
