const MvRoutes = {
  LOGIN: "/" ,
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
    FACULTY: "/admin/faculty"
  },
  MARKET_MANAGER: {
    DASHBOARD: "",
    FACULTY:"mm/faculty",
    USERS:"mm/users"
  },
  MARKET_COORDINATOR: {
    DASHBOARD: "",
    USERS: "mc/users"
  },

};

export default MvRoutes;
