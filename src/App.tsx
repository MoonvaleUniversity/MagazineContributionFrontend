import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/MvAuth/MvLogin";
import Dashboard from "./pages/MvDashboard/MvDashboard";
import MvRoutes from "./app/MvRoutes";
import MvEmailVerify from "./pages/MvAuth/MvEmailVerify";
import { MvStudentDashboard, MvStudentSubmissionsView, MvStudentContributionForm, MvStudentProfileEdit } from "./pages/Student";
import MvNotFound from "./pages/Not Found/MvNotFound";
import { AdminClosureDates } from "./pages/Admin/AdminClosureDate";


// Example auth check; update based on your actual authentication logic.
let isAuthenticated = true;
const token = localStorage.getItem("token");
if (token) {
  isAuthenticated = true;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.EMAIL_VERIFY} element={<MvEmailVerify />} />
        <Route path={MvRoutes.NOTFOUND} element={<MvNotFound />} />

        {/* Global dashboard route */}
        <Route
          path={MvRoutes.DASHBOARD}
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />

        {/* Student-specific routes */}
        <Route
          path={MvRoutes.STUDENTS.DASHBOARD}
          element={
            isAuthenticated ? <MvStudentDashboard /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />
        <Route
          path={MvRoutes.STUDENTS.SUBMISSIONS}
          element={
            isAuthenticated ? <MvStudentSubmissionsView /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />
        <Route
          path={MvRoutes.STUDENTS.CONTRIBUTION_FORM}
          element={
            isAuthenticated ? <MvStudentContributionForm /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />
        <Route
          path={MvRoutes.STUDENTS.PROFILE_EDIT}
          element={
            isAuthenticated ? <MvStudentProfileEdit /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />

        {/* Admin-specific routes */}
        <Route
          path={MvRoutes.ADMIN.CLOSURE_DATES}
          element={
            isAuthenticated ? <AdminClosureDates /> : <Navigate to={MvRoutes.LOGIN} replace />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<MvNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
