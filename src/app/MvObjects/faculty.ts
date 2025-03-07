
// Define an interface for Faculty based on your PHP model.
export interface IFaculty {
  id: number;
  name: string;
  image_url: string;
  version: string;
  created_by: number; // or string depending on your implementation
  updated_by: number; // or string
  // You can add created_at, updated_at if needed.
}