import { AxiosResponse } from "axios";
import { getData, postData, deleteData, putData } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { IFaculty } from "../app/MvObjects/faculty";

/**
 * Helper function to ensure ID is a number
 */
const parseId = (id: string | number): number => (typeof id === "string" ? parseInt(id, 10) : id);

/**
 * Fetch all faculties.
 */
export const getAllFaculties = async (): Promise<IFaculty[]> => {
  const response: AxiosResponse<{ success: boolean; faculty: IFaculty[] } > = await getData(MvUrl.GET_FACULTIES);
  return response.data.faculty;
};

/**
 * Fetch a specific faculty by its ID.
 */
export const getFacultyById = async (id: string | number): Promise<IFaculty> => {
  const numericId = parseId(id);
  const response: AxiosResponse<{ success: boolean;  faculty: IFaculty  }> = await getData(MvUrl.SHOW_FACULTY(numericId));
  return response.data.faculty;
};

/**
 * Create a new faculty.
 */
export const createFaculty = async (data: Partial<IFaculty>): Promise<IFaculty> => {
  const response: AxiosResponse<{ success: boolean; faculty: IFaculty}> = await postData(MvUrl.POST_FACULTY, data);
  return response.data.faculty;
};

/**
 * Update an existing faculty.
 */
export const updateFaculty = async (id: string | number, data: Partial<IFaculty>): Promise<IFaculty> => {
  const numericId = parseId(id);
  const response: AxiosResponse<{ success: boolean; faculty: IFaculty }> = await putData(MvUrl.UPDATE_FACULTY(numericId), data);
  return response.data.faculty;
};

/**
 * Delete a faculty by its ID.
 */
export const deleteFaculty = async (id: string | number): Promise<boolean> => {
  const numericId = parseId(id);
  try {
    const response: AxiosResponse<{ success: boolean; message?: string }> = await deleteData(MvUrl.DELETE_FACULTY(numericId));
    
    // Check if the response data contains the success field and handle accordingly
    if (response) {
      return true;
    } else {
      console.error("Unexpected response structure:", response);
      throw new Error('Unexpected response from server.');
    }
  } catch (err) {
    console.error("Error deleting faculty:", err);
    return false; // Return false in case of any error
  }
};

