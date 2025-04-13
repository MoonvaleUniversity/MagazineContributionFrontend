/* eslint-disable @typescript-eslint/no-explicit-any */
import { getData, uploadMultimedia, postData, deleteData, postBlobData} from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { IContribution, ApiContributionResponse } from "../app/Types/objects/contribution";

export const MvContributionServices = {
  // Fetch contributions
  getContributions: async (
    options?: { userId?: string; facultyId?: string; }
  ): Promise<IContribution[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (options?.userId) queryParams.append("user_id", options.userId);
      if (options?.facultyId) queryParams.append("faculty_id", options.facultyId);
      queryParams.append("noPagination", "1");

      // Corrected to use INDEX endpoint
      const url = `${MvUrl.CONTRIBUTIONS.INDEX}?${queryParams.toString()}`;

      const response = await getData(url);

      if (!response?.data?.contributions || !Array.isArray(response.data.contributions)) {
        throw new Error("Invalid response format");
      }

      return response.data.contributions.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        doc_url: item.doc_url,
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

  // Create contribution
  createContribution: async (
    userId: number,
    closureDateId: number,
    name: string,
    docFile: File,
    imageFiles: File[]
  ): Promise<ApiContributionResponse> => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId.toString());
      formData.append("closure_date_id", closureDateId.toString());
      formData.append("name", name);
      formData.append("doc", docFile);
      imageFiles.forEach(file => formData.append("images[]", file));

      const response = await uploadMultimedia(MvUrl.CONTRIBUTIONS.STORE, formData);
      return response.data as ApiContributionResponse;
    } catch (error) {
      console.error("Error creating contribution:", error);
      throw error;
    }
  },

  // Publish contribution
  publishContribution: async (id: string): Promise<IContribution> => {
    try {
      // Use postData since your route is POST api/v1/published/{id}
      const response = await postData<{ data: IContribution }>(
        MvUrl.CONTRIBUTIONS.PUBLISH(Number(id)),{}
      );

      if (!response.data?.data) {
        throw new Error("Invalid publish response format");
      }

      const item = response.data.data;
      
      return {
        id: item.id.toString(),
        name: item.name,
        doc_url: item.doc_url,
        image_url: Array.isArray(item.image_url) 
          ? item.image_url.map((img: any) => img.image_url) 
          : [],
        closure_date_id: item.closure_date_id.toString(),
        user_id: item.user_id.toString(),
        created_by: item.created_by?.toString() || "",
        created_at: item.created_at,
        is_selected_for_publication: 1 // Force to true after publishing
      };
    } catch (error) {
      console.error(`Error publishing contribution ${id}:`, error);
      throw new Error(`Publishing failed: ${(error as Error).message}`);
    }
  },

  // Download contribution
  downloadContribution: async (id: string): Promise<Blob> => {
    try {
      const response = await postBlobData<Blob>(MvUrl.CONTRIBUTIONS.DOWNLOAD(Number(id)), {});

      if (!(response.data instanceof Blob)) {
        throw new Error("Invalid file format received");
      }

      return response.data;
    } catch (error) {
      console.error("Error downloading contribution:", error);
      throw error;
    }
  },

  // Get single contribution
  getContributionById: async (id: string): Promise<IContribution> => {
    try {
      // Corrected to use SHOW endpoint
      const response = await getData(MvUrl.CONTRIBUTIONS.SHOW(Number(id)));

      if (!response?.data) {
        throw new Error("Contribution not found");
      }

      const item = response.data.contributions;
      return {
        id: item.id.toString(),
        name: item.name,
        doc_url: item.doc_url,
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

  // Delete contribution
  deleteContribution: async (id: string): Promise<void> => {
    try {
      // Corrected to use DESTROY endpoint
      
      await deleteData(MvUrl.CONTRIBUTIONS.DESTROY(Number(id)));
    } catch (error) {
      console.error(`Error deleting contribution ${id}:`, error);
      throw error;
    }
  },
};