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
  GET_CLOSURE: `${API_BASE_URL}/get_closure`,
  SHOW_CLOSURE: (id: number) => `${API_BASE_URL}/show_closure/${id}`,
  POST_CLOSURE: `${API_BASE_URL}/post_closure`,
  UPDATE_CLOSURE: (id: number) => `${API_BASE_URL}/update_closure/${id}`,
  DELETE_CLOSURE: (id: number) => `${API_BASE_URL}/delete_closure/${id}`,
  LOCK_CLOSURE: (id: number) => `${API_BASE_URL}/lock_closure/${id}`,
};
