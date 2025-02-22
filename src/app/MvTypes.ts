export interface LoginParams {
    email: string;
    password: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    token: string;
  }
  
  