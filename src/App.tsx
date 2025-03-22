import { BrowserRouter, Routes, Route } from "react-router-dom";
import MvRoutes from "./app/MvRoutes";
import Login from "./pages/MvAuth/MvLogin";
import MvEmailVerify from "./pages/MvAuth/MvEmailVerify";
import { MvStudentDashboard, MvStudentSubmissionsView, MvStudentContributionForm, MvStudentProfileEdit } from "./pages/Student";
import MvNotFound from "./pages/Not Found/MvNotFound";
import { AdminClosureDates } from "./pages/Admin/AdminClosureDate";
import { AdminAcademicYears } from "./pages/Admin/AdminAcademicYear";
import { AdminFaculties } from "./pages/Admin/AdminFaculty";
import MvContributionDetails from "./pages/Card Details/MvContributionDetails";

import ProtectedRoute from "./middleware/ProtectedRoute";
import MvNotAuthorized from "./pages/Not Found/MvNotAuthorized";
import MMFaculty from "./pages/Marketing Manager/MvMMfaculty";
import { AdminUsers } from "./pages/Admin/AdminUser";
import { MMUsers } from "./pages/Marketing Manager/MMUser";
import { McStudents } from "./pages/Marketing Coordinator/McStudent";
import { McSubmissionsView } from "./pages/Marketing Coordinator/MvMcSubmissionView";
import { MmSubmissionsView } from "./pages/Marketing Manager/MMContributions";
import { AdminSubmissionsView } from "./pages/Admin/AdminContributions";
import { McGuests } from "./pages/Marketing Coordinator/McGuests";
import RegisterGuest from "./pages/MvRegister/MvRegister";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.REGISTER} element={<RegisterGuest />} />
        <Route path={MvRoutes.EMAIL_VERIFY} element={<MvEmailVerify />} />
        <Route path={MvRoutes.NOTFOUND} element={<MvNotFound />} />
        <Route path={MvRoutes.NOTAUTHORIZED} element={<MvNotAuthorized />} />
        
        {/* Global dashboard route */}
        <Route path={MvRoutes.DASHBOARD} element={
          <ProtectedRoute roles={['Admin', 'Student', 'Marketing Coordinator']}>
            <MvContributionDetails />
          </ProtectedRoute>
        } />
        
        {/* Student-specific routes */}
        <Route path={MvRoutes.STUDENTS.DASHBOARD} element={
          <ProtectedRoute roles={['Student']}>
            <MvStudentDashboard />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.SUBMISSIONS} element={
          <ProtectedRoute roles={['Student']}>
            <MvStudentSubmissionsView />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.CONTRIBUTION_FORM} element={
          <ProtectedRoute roles={['Student']}>
            <MvStudentContributionForm />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Student']}>
            <MvStudentProfileEdit />
          </ProtectedRoute>
        } />
        
        {/* Admin-specific routes */}
        <Route path={MvRoutes.ADMIN.CLOSURE_DATES} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminClosureDates />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.ACADEMIC_YEAR} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminAcademicYears />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.FACULTY} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminFaculties />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.USERS} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminUsers/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.CONTRIBUTION} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminSubmissionsView/>
          </ProtectedRoute>
        } />
          {/* Marketing Manager-specific routes */}
        <Route path={MvRoutes.MARKET_MANAGER.FACULTY} element={
          <ProtectedRoute roles={['Marketing Manager']}>
           <MMFaculty/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.MARKET_MANAGER.USERS} element={
          <ProtectedRoute roles={['Marketing Manager']}>
           <MMUsers/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.MARKET_MANAGER.SELECTED_CONTRIBUTIONS} element={
          <ProtectedRoute roles={['Marketing Manager']}>
         <MmSubmissionsView/>
          </ProtectedRoute>
        } />
          {/* Marketing Coordinator-specific routes */}
       
        <Route path={MvRoutes.MARKET_COORDINATOR.STUDENTS} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
           <McStudents/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.MARKET_COORDINATOR.GUEST} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
           <McGuests/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.MARKET_COORDINATOR.CONTRIBUTIONS} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
         <McSubmissionsView/>
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<MvNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
