import { IContribution } from "./contribution";

export interface IUser {
    id: number;
    name: string;
    academic_year_id: number | null;
    faculty_id: number |string | null;
    email: string;
    role: string;
    email_verified_at: string;
    is_suspended: number;
    version: number;
    last_login: string;
    saved_contributions: IContribution[];
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
  }
  