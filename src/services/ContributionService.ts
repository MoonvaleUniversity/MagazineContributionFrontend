
import {
  deleteData,
  getData,
  uploadMultimedia
} from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";

import { ApiContributionResponse, IContribution } from "../app/Types/objects/contribution";

export const MvContributionServices = {
  // Fetch contributions

  getContributions: async (
    options?: { userId?: string; facultyId?: string; }
  ): Promise<IContribution[]> => {
    try {
      // Build query parameters properly
      const queryParams = new URLSearchParams();
      if (options?.userId) queryParams.append("user_id", options.userId);
      if (options?.facultyId) queryParams.append("faculty_id", options.facultyId);
   
      queryParams.append("noPagination", "1")
      // Append parameters correctly to the URL
      const url = `${MvUrl.GET_CONTRIBUTIONS}?${queryParams.toString()}`;

      // Call API with the corrected URL
      const response = await getData(url);

      if (!response?.data?.contributions || !Array.isArray(response.data.contributions)) {
        throw new Error("Invalid response format");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.contributions.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        doc_url: item.doc_url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image_url: Array.isArray(item.images) ? item.images.map((img: any) => img.image_url) : [],
        closure_date_id: item.closure_date_id.toString(),
        user_id: item.user_id.toString(),
        created_by: item.created_by?.toString() || "",
        created_at: item.created_at,
        is_selected_for_publication: item.is_selected_for_publication
      }));
    } catch (error) {
      console.error("Error fetching contributions:", error);
      throw error;
    }
  },


  createContribution: async (
    userId: number,
    closureDateId: number,
    name: string,
    docFile: File,
    imageFiles: File[]
  ): Promise<ApiContributionResponse> => {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!closureDateId) throw new Error("Closure Date ID is required");

      const formData = new FormData();
      formData.append("user_id", userId.toString()); // Adjusted field name
      formData.append("closure_date_id", closureDateId.toString()); // Added closure_date_id
      formData.append("name", name);
      formData.append("doc", docFile); // Adjusted field name

      imageFiles.forEach((file) => {
        formData.append("images[]", file); // Adjusted field name
      });
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await uploadMultimedia(MvUrl.UPLOAD_CONTRIBUTION, formData);

      if (!response?.data || typeof response.data !== "object") {
        throw new Error("Invalid response: Expected contribution object.");
      }

      return response.data as ApiContributionResponse;
    } catch (error) {
      console.error("Error creating contribution:", error);
      throw error;
    }
  },

  async updateContributionStatus() {
    console.log("");
  },
  // Fetch a single contribution by ID
  getContributionById: async (id: string): Promise<IContribution> => {
    try {
      const url = `${MvUrl.GET_CONTRIBUTIONS}/${id}`;
      console.log("", url);
      const response = await getData(url);

      if (!response?.data) {
        throw new Error("Contribution not found");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = response.data.contributions;

      return {
        id: item.id.toString(),
        name: item.name,
        doc_url: item.doc_url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image_url: Array.isArray(item.images) ? item.images.map((img: any) => img.image_url) : [],
        closure_date_id: item.closure_date_id.toString(),
        user_id: item.user.name,
        created_by: item.created_by?.toString() || "",
        created_at: item.created_at,
        is_selected_for_publication: item.is_selected_for_publication
      };
    } catch (error) {
      console.error(`Error fetching contribution ${id}:`, error);
      throw error;
    }
  },

  // Delete a contribution by ID
  deleteContribution: async (id: string): Promise<void> => {
    try {
      const url = `${MvUrl.GET_CONTRIBUTIONS}/${id}`;
      await deleteData(url); // Uses DELETE HTTP method
    } catch (error) {
      console.error(`Error deleting contribution ${id}:`, error);
      throw error;
    }
  },
};
