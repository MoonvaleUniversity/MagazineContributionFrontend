import { User } from "../objects/user";

 export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      token: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any[];
    meta: {
      timestamp: string;
      status: number;
    };
  }
  