
import { getData, 
   uploadMultimedia } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";

import { ApiContributionResponse } from "../app/Types/objects/contribution";

export const MvContributionServices = {
  // Fetch contributions
 // Fetch contributions
 getContributions: async (): Promise<ApiContributionResponse[]> => {
  try {
    const response = await getData(MvUrl.GET_CONTRIBUTIONS);
    console.log(response);

    // Ensure response.data and response.data.contributions.data exist
    if (!response?.data?.contributions?.data || !Array.isArray(response.data.contributions.data)) {
      throw new Error("Invalid response format");
    }

    // Return data mapped to ApiContributionResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.contributions.data.map((item:any) => ({
      id: item.id.toString(),
      name: item.name,
      doc_url: item.doc_url,
      images: item.images ?? "", // Ensure 'images' is handled correctly
      closure_date_id: item.closure_date_id.toString(),
      user_id: item.user_id.toString(),
      created_by: item.created_by ? item.created_by.toString() : "",
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
  
  
};
