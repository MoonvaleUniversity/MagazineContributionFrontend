const MvRoutes = {
  LOGIN: "/login" ,
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  NOTFOUND: "/404",
  NOTAUTHORIZED: "/not-authorized",
  EMAIL_VERIFY: "/email-verification",
  WELCOME_USER: "/welcome-user",
  CANVAS_CORNER: "/canvas-corner",
  CREATIVE_SPARKS: "/creative-sparks",

  PUBLIC_CONTRIBUTION:"published-contributions",
  CONTRIBUTION_DETAILS: `/contributions/:id`,
  PUBLIC_CONTRIBUTION:"/published-contributions",

  STUDENTS: {
    DASHBOARD: "/students/dashboard",
    SUBMISSIONS: "/students/submissions",
    CONTRIBUTION_FORM: "/students/contribution-form",
    PROFILE_EDIT: "/students/profile-edit",
    CONTRIBUTION_ID: "/students/contributions/:id",
    CONTRIBUTION: "/students/contributions",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CLOSURE_DATES: "/admin/closure-dates",
    ACADEMIC_YEAR: "/admin/academic-year",
    FACULTY: "/admin/faculty",
    CONTRIBUTION: "/admin/contribution",
    PROFILE_EDIT: "/admin/profile-edit",
    MOST_ACTIVE_USER: "/admin/most-active-users",
    PAGE: "/admin/page-view",
    BROWSER_TRACK: "/admin/browser-track",
    USER_ACTIVITIES: "/admin/user-activities"
  },
  MARKET_MANAGER: {
    DASHBOARD: "/mm/dashboard",
    FACULTY:"/mm/faculty",
    USERS:"/mm/users",
    SELECTED_CONTRIBUTIONS: "/mm/selected_contribution",
    PROFILE_EDIT: "/mm/profile-edit",
    
  },
  MARKET_COORDINATOR: {
    DASHBOARD: "/mc/dashboard",
    STUDENTS: "/mc/students",
    GUEST: "/mc/guest",
    CONTRIBUTIONS: "/mc/contributions",
    PROFILE_EDIT: "/mc/profile-edit",
    
  },
  GUEST: {
    DASHBOARD: "/guest/dashboard",
    PROFILE_EDIT: "/guest/profile-edit",
  },

};

export default MvRoutes;
