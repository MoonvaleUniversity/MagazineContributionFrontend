const API_BASE_URL = "http://localhost:8000/api/v1"; 

export const MvUrl = {
  // Login endpoints
  LOGIN: `${API_BASE_URL}/login`,
  VERIFY_EMAIL: (id: number) => `${API_BASE_URL}/email_verifying/${id}`,
  SEND_VERIFICATION: (email: string) => `${API_BASE_URL}/email_verification_sending/${email}`,
  CONFIRM_VERIFICATION_PAGE: (id: number) => `${API_BASE_URL}/confirmed_email_verification/${id}`,
  CONFIRM_VERIFICATION_POST: (id: number) => `${API_BASE_URL}/confirmed_email_verification/${id}`,
  GET_LOGGED_IN_USER: `${API_BASE_URL}/login-user`,

  // Closure Date endpoints
  GET_CLOSURE: `${API_BASE_URL}/closure-dates`, // Fetch all closure dates
  SHOW_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`, // Show a specific closure date
  POST_CLOSURE: `${API_BASE_URL}/closure-dates`, // Create a closure date
  UPDATE_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`, // Update a closure date
  DELETE_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}`, // Delete a closure date
  LOCK_CLOSURE: (id: number) => `${API_BASE_URL}/closure-dates/${id}/lock`, // Lock a closure date

     GET_CONTRIBUTIONS: `${API_BASE_URL}/contributions`, // Fetch all contributions
    UPLOAD_CONTRIBUTION: `${API_BASE_URL}/contributions`, // Upload a new contribution
  };
  