const API_BASE_URL = "http://localhost:8000/api/v1";

export const MvUrl = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  VERIFY_EMAIL: (id: number) => `${API_BASE_URL}/email_verifying/${id}`,
  SEND_VERIFICATION: (email: string) => `${API_BASE_URL}/email_verification_sending/${email}`,
  CONFIRM_VERIFICATION_PAGE: (id: number) => `${API_BASE_URL}/confirmed_email_verification/${id}`,
  CONFIRM_VERIFICATION_POST: (id: number) => `${API_BASE_URL}/confirmed_email_verification/${id}`,
  GET_LOGGED_IN_USER: `${API_BASE_URL}/login-user`,

  // Closure Date endpoints
  GET_CLOSURE: `${API_BASE_URL}/closure-dates`,
  SHOW_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`,
  POST_CLOSURE: `${API_BASE_URL}/closure-dates`,
  UPDATE_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`,
  DELETE_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`,

     // Contributions
     CONTRIBUTIONS: {
      INDEX: `${API_BASE_URL}/contributions`,
      STORE: `${API_BASE_URL}/contributions`,
      SHOW: (id: number) => `${API_BASE_URL}/contributions/${id}`,
      UPDATE: (id: number) => `${API_BASE_URL}/contributions/${id}`,
      DESTROY: (id: number) => `${API_BASE_URL}/contributions/${id}`,
      DOWNLOAD: (id: number) => `${API_BASE_URL}/download/${id}`,
      PUBLISH: (id: number) => `${API_BASE_URL}/published/${id}`,
      EMAIL_AUTO: `${API_BASE_URL}/emailAuto`,
      COMMENT: (id: number) => `${API_BASE_URL}/contributions/${id}/comment`,
      DELETE_COMMENT: (id: number) => `${API_BASE_URL}/contributions/${id}/delete-comment`,
      GET_COMMENT: (id: number) => `${API_BASE_URL}/contributions/${id}/get-comment`,
      REVIEW: (id: number) => `${API_BASE_URL}/contributions/${id}/review`,
      SAVE: (id: number) => `${API_BASE_URL}/contributions/${id}/save`,
      VOTE: (id: number) => `${API_BASE_URL}/contributions/${id}/vote`,
    },
 // Add new Creative Sparks section
 CREATIVE_SPARKS: {
  INDEX: `${API_BASE_URL}/creative-sparks`,
  STORE: `${API_BASE_URL}/creative-sparks`,
  SHOW: (id: number) => `${API_BASE_URL}/creative-sparks/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/creative-sparks/${id}`,
  DESTROY: (id: number) => `${API_BASE_URL}/creative-sparks/${id}`,
},

  // Academic Year endpoints
  GET_ACADEMIC_YEARS: `${API_BASE_URL}/academic-years`,    // Get all academic years
  SHOW_ACADEMIC_YEAR: (id: number) => `${API_BASE_URL}/academic-years/${id}`, // Get a specific academic year
  POST_ACADEMIC_YEAR: `${API_BASE_URL}/academic-years`,    // Create a new academic year
  UPDATE_ACADEMIC_YEAR: (id: number) => `${API_BASE_URL}/academic-years/${id}`, // Update an academic year
  DELETE_ACADEMIC_YEAR: (id: number) => `${API_BASE_URL}/academic-years/${id}`, // Delete an academic year

  // Faculty endpoints
  GET_FACULTIES: `${API_BASE_URL}/faculties`,              // Fetch all faculties
  SHOW_FACULTY: (id: number) => `${API_BASE_URL}/faculties/${id}`, // Show a specific faculty
  POST_FACULTY: `${API_BASE_URL}/faculties`,               // Create a new faculty
  UPDATE_FACULTY: (id: number) => `${API_BASE_URL}/faculties/${id}`, // Update a faculty
  DELETE_FACULTY: (id: number) => `${API_BASE_URL}/faculties/${id}`, // Delete a faculty

  // Users endpoints
  GET_USERS: `${API_BASE_URL}/users`,                      // Get all users
  SHOW_USER: (id: number) => `${API_BASE_URL}/users/${id}`,  // Get a specific user
  POST_USER: `${API_BASE_URL}/users`,                      // Create a new user
  UPDATE_USER: (id: number) => `${API_BASE_URL}/users/${id}`,// Update a user
  DELETE_USER: (id: number) => `${API_BASE_URL}/users/${id}`,// Delete a user

  // Role-Specific Users
  ADMINS: {
    INDEX: `${API_BASE_URL}/admins`,
    STORE: `${API_BASE_URL}/admins`,
    SHOW: (id: number) => `${API_BASE_URL}/admins/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/admins/${id}`,
    DESTROY: (id: number) => `${API_BASE_URL}/admins/${id}`,
  },

  COORDINATORS: {
    INDEX: `${API_BASE_URL}/coordinators`,
    STORE: `${API_BASE_URL}/coordinators`,
    SHOW: (id: number) => `${API_BASE_URL}/coordinators/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/coordinators/${id}`,
    DESTROY: (id: number) => `${API_BASE_URL}/coordinators/${id}`,
  },

  MANAGERS: {
    INDEX: `${API_BASE_URL}/managers`,
    STORE: `${API_BASE_URL}/managers`,
    SHOW: (id: number) => `${API_BASE_URL}/managers/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/managers/${id}`,
    DESTROY: (id: number) => `${API_BASE_URL}/managers/${id}`,
  },

  STUDENTS: {
    INDEX: `${API_BASE_URL}/students`,
    STORE: `${API_BASE_URL}/students`,
    SHOW: (id: number) => `${API_BASE_URL}/students/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/students/${id}`,
    DESTROY: (id: number) => `${API_BASE_URL}/students/${id}`,
  },

  GUESTS: {
    INDEX: `${API_BASE_URL}/guests`,
    STORE: `${API_BASE_URL}/guests`,
    SHOW: (id: number) => `${API_BASE_URL}/guests/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/guests/${id}`,
    DESTROY: (id: number) => `${API_BASE_URL}/guests/${id}`,
    APPROVE: (id: number) => `${API_BASE_URL}/guests/${id}/approve`,
  },

    //Logout 
    LOGOUT : `${API_BASE_URL}/logout`,

    //Page View
    GET_PAGEVIEW: `${API_BASE_URL}/page-views`,
    POST_PAGEVIEW : `${API_BASE_URL}/page-views`,
    SHOW_PAGEVIEW : `${API_BASE_URL}/most-visited-pages`,
  
    //Browser
    GET_BROWSER_TYPE : `${API_BASE_URL}/browser_tracks`,
    POST_BROWSER_TYPE : `${API_BASE_URL}/browser_tracks`,

};
