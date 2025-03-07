import { AxiosResponse } from "axios";
import { getData, postData, putData, deleteData } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { IFaculty } from "../app/MvObjects/faculty";


/**
 * Fetch all faculties.
 */
export const getAllFaculties = async (): Promise<IFaculty[]> => {
  const response: AxiosResponse<{ faculties: IFaculty[] }> = await getData(MvUrl.GET_FACULTIES);
  return response.data.faculties;
};

/**
 * Fetch a specific faculty by its ID.
 */
export const getFacultyById = async (id: number): Promise<IFaculty> => {
  const response: AxiosResponse<{ faculty: IFaculty }> = await getData(MvUrl.SHOW_FACULTY(id));
  return response.data.faculty;
};

/**
 * Create a new faculty.
 */
export const createFaculty = async (data: Partial<IFaculty>): Promise<IFaculty> => {
  const response: AxiosResponse<{ faculty: IFaculty }> = await postData(MvUrl.POST_FACULTY, data);
  return response.data.faculty;
};

/**
 * Update an existing faculty.
 */
export const updateFaculty = async (id: number, data: Partial<IFaculty>): Promise<IFaculty> => {
  const response: AxiosResponse<{ faculty: IFaculty }> = await putData(MvUrl.UPDATE_FACULTY(id), data);
  return response.data.faculty;
};

/**
 * Delete a faculty by its ID.
 */
export const deleteFaculty = async (id: number): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ success: boolean }> = await deleteData(MvUrl.DELETE_FACULTY(id));
    return response.data.success;
  } catch (error) {
    console.error("Failed to delete faculty:", error);
    throw error;
  }
};
