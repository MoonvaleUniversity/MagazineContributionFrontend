const MvRoutes = {
  LOGIN: "/",
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
    CLOSURE_DATES: "/admin/closure-dates",
    // Add other admin routes as needed
  },
};

export default MvRoutes;
