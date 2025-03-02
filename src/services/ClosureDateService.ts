import { getData, postData } from "../app/MvApi";
import { IClosureDate } from "../app/MvObjects/clousuredate";
import { MvUrl } from "../app/MvUrl";
import { AxiosResponse } from "axios";



/**
 * Fetch all closure dates.
 */
export const getAllClosureDates = async (): Promise<IClosureDate[]> => {
    const response: AxiosResponse<{ closure_data: IClosureDate[] }> = await getData(MvUrl.GET_CLOSURE);
    return response.data.closure_data;
};

/**
 * Fetch a closure date by ID.
 */
export const getClosureDateById = async (id: number): Promise<IClosureDate> => {
    const response: AxiosResponse<{ closure_date: IClosureDate }> = await getData(MvUrl.SHOW_CLOSURE(id));
    return response.data.closure_date;
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
    const response: AxiosResponse<{ closure_date: IClosureDate }> = await postData(MvUrl.UPDATE_CLOSURE(id), data);
    return response.data.closure_date;
};

/**
 * Delete a closure date by ID.
 */
export const deleteClosureDate = async (id: number): Promise<boolean> => {
    const response: AxiosResponse<{ success: boolean }> = await getData(MvUrl.DELETE_CLOSURE(id));
    return response.data.success;
};

/**
 * Lock submissions for a given contribution.
 */
export const lockClosureDate = async (contributionId: number): Promise<boolean> => {
    const response: AxiosResponse<{ success: boolean }> = await postData(MvUrl.LOCK_CLOSURE(contributionId), {});
    return response.data.success;
};
