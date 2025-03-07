import { deleteData, getData, postData, putData } from "../app/MvApi";
import { AxiosResponse } from "axios";
import { MvUrl } from "../app/MvUrl";
import { IAcademicYear } from "../app/MvObjects/academicyear";


/**
 * Fetch all academic years.
 */
export const getAllAcademicYears = async (): Promise<IAcademicYear[]> => {
  const response: AxiosResponse<{ academic_years: IAcademicYear[] }> = await getData(MvUrl.GET_ACADEMIC_YEARS);
  return response.data.academic_years;
};

/**
 * Fetch a single academic year by its ID.
 */
export const getAcademicYearById = async (id: number): Promise<IAcademicYear> => {
  const response: AxiosResponse<{ academic_year: IAcademicYear }> = await getData(MvUrl.SHOW_ACADEMIC_YEAR(id));
  return response.data.academic_year;
};

/**
 * Create a new academic year.
 */
export const createAcademicYear = async (data: Partial<IAcademicYear>): Promise<IAcademicYear> => {
  const response: AxiosResponse<{ academic_year: IAcademicYear }> = await postData(MvUrl.POST_ACADEMIC_YEAR, data);
  return response.data.academic_year;
};

/**
 * Update an existing academic year.
 */
export const updateAcademicYear = async (id: number, data: Partial<IAcademicYear>): Promise<IAcademicYear> => {
  const response: AxiosResponse<{ academic_year: IAcademicYear }> = await putData(MvUrl.UPDATE_ACADEMIC_YEAR(id), data);
  return response.data.academic_year;
};

/**
 * Delete an academic year by its ID.
 */
export const deleteAcademicYear = async (id: number): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ success: boolean }> = await deleteData(MvUrl.DELETE_ACADEMIC_YEAR(id));
    return response.data.success;
  } catch (error) {
    console.error("Failed to delete academic year:", error);
    throw error;
  }
};
