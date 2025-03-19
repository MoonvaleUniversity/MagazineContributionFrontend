import { deleteData, getData, postData, putData } from "../app/MvApi";
import { IClosureDate } from "../app/MvObjects/clousuredate";
import { MvUrl } from "../app/MvUrl";
import { AxiosResponse } from "axios";

const parseId = (id: string | number): number => (typeof id === "string" ? parseInt(id, 10) : id);

/**
 * Fetch all closure dates.
 */
export const getAllClosureDates = async (): Promise<IClosureDate[]> => {
   console.log( MvUrl.GET_CLOSURE);
    const response: AxiosResponse<{ closure_dates: IClosureDate[] }> = await getData(MvUrl.GET_CLOSURE);
    return response.data.closure_dates;
};

/**
 * Fetch a closure date by ID.
 */
export const getClosureDateById = async (id: number |string): Promise<IClosureDate> => {
    const numericId = parseId(id);
    const response: AxiosResponse<{ closure_dates: IClosureDate }> = await getData(MvUrl.SHOW_CLOSURE(numericId));
    return response.data.closure_dates;
};

/**
 * Create a new closure date.
 */
export const createClosureDate = async (data: Partial<IClosureDate>): Promise<IClosureDate> => {
    const response: AxiosResponse<{ closure_data: IClosureDate }> = await postData(MvUrl.POST_CLOSURE, data);
    return response.data.closure_data;
};

/**
 * Update a closure date by ID.
 */
export const updateClosureDate = async (id: number, data: Partial<IClosureDate>): Promise<IClosureDate> => {
    const response: AxiosResponse<{ closure_dates: IClosureDate }> = await putData(MvUrl.UPDATE_CLOSURE(id), data);  // Use putData instead of postData
    return response.data.closure_dates;
};

/**
 * Delete a closure date by ID.
 */
export const deleteClosureDate = async (id: number): Promise<boolean> => {
    try {
        const response: AxiosResponse<{ success?: boolean }> = await deleteData(MvUrl.DELETE_CLOSURE(id));

        // Log the response data to debug
        console.log("Delete response:", response.data);

        // Check if response.data exists and contains success
        if (response.data && response.data.success !== undefined) {
            return response.data.success;
        } else {
            // Handle case where success is not present
            console.error("Unexpected response structure:", response.data);
            return false;
        }
    } catch (error) {
        console.error("Failed to delete closure date:", error);
        throw error;
    }
};

/**
 * Lock submissions for a given contribution.
 */
export const lockClosureDate = async (contributionId: number): Promise<boolean> => {
    const response: AxiosResponse<{ success: boolean }> = await postData(MvUrl.LOCK_CLOSURE(contributionId), {});
    return response.data.success;
};
