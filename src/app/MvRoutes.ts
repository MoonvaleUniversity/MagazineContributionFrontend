const MvRoutes = {
  LOGIN: "/" ,
  DASHBOARD: "/dashboard",
  NOTFOUND: "/404",
  EMAIL_VERIFY: "/email-verification",
  STUDENTS: {
    DASHBOARD: "/students/dashboard",
    SUBMISSIONS: "/students/submissions",
    CONTRIBUTION_FORM: "/students/contribution-form",
    PROFILE_EDIT: "/students/profile-edit",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CREATE_ACCOUNT: "/admin/create-mm-account",
    CLOSURE_DATES: "/admin/closure-dates",
    ACADEMIC_YEAR: "/admin/academic-year",
    FACULTY: "/admin/faculty"
  },
};

export default MvRoutes;
