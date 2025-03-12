import { AxiosResponse } from "axios";
import { getData, deleteData,  uploadMultimedia, updateMultimedia } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { IFaculty, ResponseFaculty } from "../app/MvObjects/faculty";

/**
 * Helper function to ensure ID is a number
 */
const parseId = (id: string | number): number => (typeof id === "string" ? parseInt(id, 10) : id);

/**
 * Fetch all faculties.
 */
export const getAllFaculties = async (): Promise<ResponseFaculty[]> => {
  const response: AxiosResponse<{ success: boolean; faculties: { data: ResponseFaculty[] } }> = await getData(MvUrl.GET_FACULTIES);
  console.log(response);
  return response.data.faculties.data;
};

/**
 * Fetch a specific faculty by its ID.
 */
export const getFacultyById = async (id: string | number): Promise<ResponseFaculty> => {
  const numericId = parseId(id);
  const response: AxiosResponse<{ success: boolean; faculties: ResponseFaculty }> = await getData(MvUrl.SHOW_FACULTY(numericId));
  console.log(response);
  return response.data.faculties;
};

/**
 * Create a new faculty.
 */
export const createFaculty = async (data: FormData): Promise<IFaculty> => {
  const response: AxiosResponse<{ success: boolean; faculties:  ResponseFaculty }> =
    await uploadMultimedia(MvUrl.POST_FACULTY, data);
    console.log(response);
  return response.data.faculties;
};

export const updateFaculty = async (id: string | number, data: FormData): Promise<IFaculty> => {
  const numericId = parseId(id);
  const response: AxiosResponse<{ success: boolean; faculties: ResponseFaculty  }> =
    await updateMultimedia(MvUrl.UPDATE_FACULTY(numericId), data);
  return response.data.faculties;
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
    console.error("Error deleting faculties:", err);
    return false; // Return false in case of any error
  }
};
