import { BrowserRouter, Routes, Route } from "react-router-dom";
import MvRoutes from "./app/MvRoutes";
import Login from "./pages/MvAuth/MvLogin";
import MvEmailVerify from "./pages/MvAuth/MvEmailVerify";
import { MvStudentSubmissionsView, MvStudentContributionForm, MvStudentProfileEdit, MvStudentDashboard } from "./pages/Student";
import MvNotFound from "./pages/Not Found/MvNotFound";
import { AdminClosureDates } from "./pages/Admin/AdminClosureDate";
import { AdminAcademicYears } from "./pages/Admin/AdminAcademicYear";
import { AdminFaculties } from "./pages/Admin/AdminFaculty";

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
import { CanvasCorner } from "./pages/MvCanvasCorner/MvCanvasCorner";
import { WelcomeUser } from "./pages/MvAuth/MvWelcomeUser";

import AuthCheck from "./components/Auth/AuthCheck";
import { MmProfileEdit } from "./pages/Marketing Manager/MMProfileEdit";
import { McProfileEdit } from "./pages/Marketing Coordinator/McProfileEdit";
import { MmDashboard } from "./pages/Marketing Manager/MMdashboard";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import MvContributionDetailsPage from "./pages/Card Details/MvContributionDetails";
import { McDashboard } from "./pages/Marketing Coordinator/McDashboard";
import { AdminProfileEdit } from "./pages/Admin/AdminProfile";
import GuestDashboard from "./pages/Guest/GuestDashboard";
import { MvGlobalContributions } from "./components/MvContributions/publishedContributions";
import { MvCreativeSparksPage } from "./pages/CreativeSparks";

import MostActiveUsers from "./pages/Admin/MostActiveUsers";
import MostPageView from "./pages/Admin/MostPageView";
import MostBrowserUse from "./pages/Admin/MostBrowserUse";
import UserLastLogin from "./pages/Admin/UserLastLogin";

import { GuestEdit } from "./pages/Guest/GuestProfileEdit";



function App() {

  return (
    <BrowserRouter>
      <Routes>
         {/* Root path handler */}
         <Route path="/" element={<AuthCheck />} />
        {/* Public Routes */}
        <Route path={MvRoutes.LOGIN} element={<Login />} />
        <Route path={MvRoutes.REGISTER} element={<RegisterGuest />} />
        <Route path={MvRoutes.EMAIL_VERIFY} element={<MvEmailVerify />} />
        <Route path={MvRoutes.NOTFOUND} element={<MvNotFound />} />
        <Route path={MvRoutes.NOTAUTHORIZED} element={<MvNotAuthorized />} />
        <Route path={MvRoutes.WELCOME_USER} element={<WelcomeUser />} />
        <Route path={MvRoutes.CANVAS_CORNER} element={ <CanvasCorner/>} />
        
        <Route 
  path={`${MvRoutes.CONTRIBUTION_DETAILS}`} 
  element={
    <ProtectedRoute roles={['Student',"Guest", 'Admin', 'Marketing Coordinator', 'Marketing Manager']}>
      <MvContributionDetailsPage />
    </ProtectedRoute>
  }
/>
        <Route 
  path={MvRoutes.PUBLIC_CONTRIBUTION} 
  element={
    <ProtectedRoute roles={['Student',"Guest", 'Admin', 'Marketing Coordinator', 'Marketing Manager']}>
       <MvGlobalContributions/>
    </ProtectedRoute>
  }
/>
        <Route 
  path={MvRoutes.CREATIVE_SPARKS} 
  element={
    <ProtectedRoute roles={['Student',"Guest", 'Admin', 'Marketing Coordinator', 'Marketing Manager']}>
      <MvCreativeSparksPage/>
    </ProtectedRoute>
  }
/>
          
        {/* Student-specific routes */}
        <Route path={MvRoutes.STUDENTS.DASHBOARD} element={
          <ProtectedRoute roles={['Student']}>
           <MvStudentDashboard/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.SUBMISSIONS} element={
          <ProtectedRoute roles={['Student']}>
            <MvStudentSubmissionsView />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.CONTRIBUTION_FORM_EDIT} element={
          <ProtectedRoute roles={['Student' , 'Marketing Coordinator']}>
            <MvStudentContributionForm />
          </ProtectedRoute>
        } />
          <Route path={MvRoutes.STUDENTS.CONTRIBUTION_FORM} element={
          <ProtectedRoute roles={['Student']} >
            <MvStudentContributionForm />
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.STUDENTS.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Student' ]}>
            <MvStudentProfileEdit />
          </ProtectedRoute>
        } />
        
        {/* Admin-specific routes */}
        <Route path={MvRoutes.ADMIN.DASHBOARD} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminDashboard/>
          </ProtectedRoute>
        } />
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
        <Route path={MvRoutes.ADMIN.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminProfileEdit/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.CONTRIBUTION} element={
          <ProtectedRoute roles={['Admin']}>
            <AdminSubmissionsView/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.MOST_ACTIVE_USER} element={
          <ProtectedRoute roles={['Admin']}>
            <MostActiveUsers/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.ADMIN.PAGE} element={
          <ProtectedRoute roles={['Admin']}>
            <MostPageView/>
          </ProtectedRoute>
        } />
         <Route path={MvRoutes.ADMIN.BROWSER_TRACK} element={
          <ProtectedRoute roles={['Admin']}>
            <MostBrowserUse/>
          </ProtectedRoute>
        } />
         <Route path={MvRoutes.ADMIN.USER_ACTIVITIES} element={
          <ProtectedRoute roles={['Admin']}>
            <UserLastLogin/>
          </ProtectedRoute>
        } />
          {/* Marketing Manager-specific routes */}
        <Route path={MvRoutes.MARKET_MANAGER.DASHBOARD} element={
          <ProtectedRoute roles={['Marketing Manager']}>
           <MmDashboard/>
          </ProtectedRoute>
        } />
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
        <Route path={MvRoutes.MARKET_MANAGER.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Marketing Manager']}>
            <MmProfileEdit/>
          </ProtectedRoute>
        } />
          {/* Marketing Coordinator-specific routes */}
       
        <Route path={MvRoutes.MARKET_COORDINATOR.STUDENTS} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
           <McStudents/>
          </ProtectedRoute>
        } />
        <Route path={MvRoutes.MARKET_COORDINATOR.DASHBOARD} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
          <McDashboard></McDashboard>
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
        <Route path={MvRoutes.MARKET_COORDINATOR.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Marketing Coordinator']}>
        <McProfileEdit/>
          </ProtectedRoute>
        } />
         {/* Guest-specific routes */}
        <Route path={MvRoutes.GUEST.DASHBOARD} element={
          <ProtectedRoute roles={['Guest']}>
            <GuestDashboard/>
          </ProtectedRoute>
        } />
         {/* Guest-specific routes */}
        <Route path={MvRoutes.GUEST.PROFILE_EDIT} element={
          <ProtectedRoute roles={['Guest']}>
           <GuestEdit/>
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<MvNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
