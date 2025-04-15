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
        id: item.id,
        name: item.name,
        doc_url: item.doc_url,
        image_url: item.images || [],
        closure_date_id: item.closure_date_id,
        user_id: item.user_id,
        created_by: item.created_by,
        created_at: item.created_at,
        is_selected_for_publication: item.is_selected_for_publication,
        user: item.user,
        version: item.version,
        updated_by: item.updated_by,
        updated_at: item.updated_at
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
      
      return item;
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
    const response = await getData(
      MvUrl.CONTRIBUTIONS.SHOW(Number(id))
    );

    if (!response?.data?.contributions) {
      throw new Error("Contribution not found");
    }

    // Map the API response to match IContribution interface
    return {
      id: response.data.contributions.id,
      name: response.data.contributions.name,
      user_id: response.data.contributions.user_id,
      closure_date_id: response.data.contributions.closure_date_id,
      doc_url: response.data.contributions.doc_url,
      is_selected_for_publication: response.data.contributions.is_selected_for_publication,
      version: response.data.contributions.version,
      created_by: response.data.contributions.created_by,
      updated_by: response.data.contributions.updated_by,
      created_at: response.data.contributions.created_at,
      updated_at: response.data.contributions.updated_at,
      image_url: response.data.contributions.images.map((img: { id: any; image_url: any; created_at: any; updated_at: any; }) => ({
        id: img.id,
        image_url: img.image_url,
        created_at: img.created_at,
        updated_at: img.updated_at
      })),
      user: {
        id: response.data.contributions.user.id,
        name: response.data.contributions.user.name,
        faculty: {
          id: response.data.contributions.user.faculty.id,
          name: response.data.contributions.user.faculty.name,
          image_url: response.data.contributions.user.faculty.image_url,
          description: response.data.contributions.user.faculty.description
        },
        roles: response.data.contributions.user.roles.map((role: { id: any; name: any; pivot: { model_type: any; model_id: any; role_id: any; }; }) => ({
          id: role.id,
          name: role.name,
          pivot: {
            model_type: role.pivot.model_type,
            model_id: role.pivot.model_id,
            role_id: role.pivot.role_id
          }
        }))
      }
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