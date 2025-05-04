import {  IFaculty } from "./contribution";

export interface IUser {
    id: number;
    name: string;
    academic_year_id: number | null;
    faculty_id: number |string | null;
    faculty?: IFaculty;
    email: string;
    role: string;
    email_verified_at: string;
    is_approved?: number
    is_suspended: number;
    version: number;
    saved_contributions: Contribution[];
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
  }
  

 export interface Contribution {
    id: number | string;
    name: string;
    doc_url: string;
    created_at: string;
  }