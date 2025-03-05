
import { getData, 
   uploadMultimedia } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { Contribution } from "../app/MvObjects/contribution";
import { IContribution, ApiContributionResponse } from "../app/Types/objects/contribution";

export const MvContributionServices = {
  // Fetch contributions
  getContributions: async (): Promise<IContribution[]> => {
    try {
      const response = await getData(MvUrl.GET_CONTRIBUTIONS);

      // Ensure response.data exists and is an array
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      // Map raw data to Contribution objects
      return response.data.map((item: ApiContributionResponse) => Contribution.fromMap(item));
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
  ): Promise<IContribution> => {
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
  
      return Contribution.fromMap(response.data as ApiContributionResponse);
    } catch (error) {
      console.error("Error creating contribution:", error);
      throw error;
    }
  },
  
  
};
