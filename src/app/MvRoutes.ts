const MvRoutes = {
  LOGIN: "/" ,
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  NOTFOUND: "/404",
  NOTAUTHORIZED: "/404",
  EMAIL_VERIFY: "/email-verification",
  STUDENTS: {
    DASHBOARD: "/students/dashboard",
    SUBMISSIONS: "/students/submissions",
    CONTRIBUTION_FORM: "/students/contribution-form",
    PROFILE_EDIT: "/students/profile-edit",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CLOSURE_DATES: "/admin/closure-dates",
    ACADEMIC_YEAR: "/admin/academic-year",
    FACULTY: "/admin/faculty",
    CONTRIBUTION: "/admin/contribution",
    PROFILE_EDIT: "/students/profile-edit",
  },
  MARKET_MANAGER: {
    DASHBOARD: "/mm/dashboard",
    FACULTY:"/mm/faculty",
    USERS:"/mm/users",
    SELECTED_CONTRIBUTIONS: "/mm/selected_contribution",
    PROFILE_EDIT: "/students/profile-edit",
  },
  MARKET_COORDINATOR: {
    DASHBOARD: "",
    STUDENTS: "mc/students",
    GUEST: "mc/guest",
    CONTRIBUTIONS: "mc/contributions",
    PROFILE_EDIT: "/students/profile-edit",
  },

};

export default MvRoutes;
