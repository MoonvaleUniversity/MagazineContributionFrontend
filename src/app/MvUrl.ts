const API_BASE_URL = "http://localhost:8000/api/v1";

export const MvUrl = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URL}/login`,
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

  // Contributions endpoints
  GET_CONTRIBUTIONS: `${API_BASE_URL}/contributions`,
  UPLOAD_CONTRIBUTION: `${API_BASE_URL}/contributions`,

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
  },

};
