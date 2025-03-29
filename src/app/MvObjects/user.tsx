import { IUser } from "../Types/objects/user";


export class User {
  id: number;
  name: string;
  academicYearId: number | null;
  faculty_id: number | string | null;
  email: string;
  emailVerifiedAt: string;
  isSuspended: number;
  version: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.academicYearId = data.academic_year_id;
    this.faculty_id = data.faculty_id;
    this.email = data.email;
    this.emailVerifiedAt = data.email_verified_at;
    this.isSuspended = data.is_suspended;
    this.version = data.version;
    this.createdBy = data.created_by;
    this.updatedBy = data.updated_by;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.role = data.role;
   
  }

  // Mapping from JSON to a User instance
  static fromJSON(data: IUser): User {
    return new User(data);
  }

  // Convert the instance back to a plain object
  toMap(): object {
    return {
      id: this.id,
      name: this.name,
      academic_year_id: this.academicYearId,
      faculty_id: this.faculty_id,
      email: this.email,
      email_verified_at: this.emailVerifiedAt,
      is_suspended: this.isSuspended,
      version: this.version,
      created_by: this.createdBy,
      updated_by: this.updatedBy,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      role: this.role,
      
    };
  }
}
