/* eslint-disable @typescript-eslint/no-explicit-any */
import { getData, uploadMultimedia, postData, deleteData, } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import { IContribution, IComment, IVote, ApiContributionResponse } from "../app/Types/objects/contribution";

export const MvContributionServices = {
  // Fetch contributions with proper typing
  getContributions: async (
    options?: { userId?: string; facultyId?: string; published?: boolean }
  ): Promise<IContribution[]> => {
    try {
      const params = new URLSearchParams({ noPagination: "1" });
      if (options?.userId) params.append("user_id", options.userId);
      if (options?.facultyId) params.append("faculty_id", options.facultyId);
      if (options?.published) params.append("is_selected_for_publication", "1");

      const { data } = await getData(
        `${MvUrl.CONTRIBUTIONS.INDEX}?${params}`
      );

      if (!Array.isArray(data?.contributions)) {
        throw new Error("Invalid contributions response format");
      }

      return data.contributions.map(normalizeContribution);
    } catch (error) {
      handleServiceError("Error fetching contributions:", error);
      throw error;
    }
  },

  // Create contribution with proper FormData handling
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

      const { data } = await uploadMultimedia<ApiContributionResponse>(
        MvUrl.CONTRIBUTIONS.STORE,
        formData
      );
      return data;
    } catch (error) {
      handleServiceError("Error creating contribution:", error);
      throw error;
    }
  },

  // Publish contribution with proper response handling
  publishContribution: async (id: string): Promise<boolean> => {
    try {
      const { data } = await postData<{ success: boolean }>(
        MvUrl.CONTRIBUTIONS.PUBLISH(Number(id)),
        {}
      );
      return data?.success ?? false;
    } catch (error) {
      handleServiceError(`Error publishing contribution ${id}:`, error);
      throw error;
    }
  },

  // Get single contribution with normalized response
  getContributionById: async (id: string): Promise<IContribution> => {
    try {
      const { data } = await getData(
        MvUrl.CONTRIBUTIONS.SHOW(Number(id))
      );
      
      if (!data?.contributions) throw new Error("Contribution not found");
      
      return normalizeContribution(data.contributions);
    } catch (error) {
      handleServiceError(`Error fetching contribution ${id}:`, error);
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
  // Comment features with proper typing
  comment: {
    add: async (contributionId: number, userId: number, content: string): Promise<IComment> => {
      try {
        const { data } = await postData<{ comment: IComment }>(
          MvUrl.CONTRIBUTIONS.COMMENT(contributionId),
          { user_id: userId, content }
        );
        console.log(data);
        return data.comment;
      } catch (error) {
        handleServiceError("Error adding comment:", error);
        throw error;
      }
    },

    delete: async (contributionId: number, userId: number): Promise<void> => {
      try {
        await postData(
          `${MvUrl.CONTRIBUTIONS.DELETE_COMMENT(contributionId)}?user_id=${userId}` , {}
        );
      } catch (error) {
        handleServiceError("Error deleting comment:", error);
        throw error;
      }
    },

    getAll: async (contributionId: number): Promise<IComment[]> => {
      try {
        // Changed to POST as per your API requirements
        const { data } = await postData<{ comments: IComment[] }>(
          MvUrl.CONTRIBUTIONS.GET_COMMENT(contributionId),
          {}
        );
        return data?.comments || [];
      } catch (error) {
        handleServiceError("Error fetching comments:", error);
        throw error;
      }
    }
  },

  // Voting system with proper typing
  vote: {
    add: async (contributionId: number, userId: number, type: IVote['type']): Promise<IVote> => {
      try {
        const { data } = await postData<{ vote: IVote }>(
          MvUrl.CONTRIBUTIONS.VOTE(contributionId),
          { user_id: userId, type }
        );
        return data.vote;
      } catch (error) {
        handleServiceError("Error adding vote:", error);
        throw error;
      }
    }
  },

  // Save/Bookmark feature
toggleSave: async (
  contributionId: number,
  userId: number
): Promise<any> => {
  try {
    const response = await postData(
      MvUrl.CONTRIBUTIONS.SAVE(contributionId),
      { user_id: userId }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling save:", error);
    throw error;
  }
},

// Email automation trigger
triggerEmailAuto: async (): Promise<void> => {
  try {
    await postData(MvUrl.CONTRIBUTIONS.EMAIL_AUTO, {});
  } catch (error) {
    console.error("Error triggering email automation:", error);
    throw error;
  }
},

// Review system (assuming JSON response)
submitReview: async (
  contributionId: number,
  reviewData: { review: string},
): Promise<any> => {
  try {
    const response = await postData(
      MvUrl.CONTRIBUTIONS.REVIEW(contributionId),
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
},

// Update existing contribution
updateContribution: async (
  id: number,
  updateData: Partial<IContribution>
): Promise<IContribution> => {
  try {
    const response = await postData<{ data: IContribution }>(
      MvUrl.CONTRIBUTIONS.UPDATE(id),
      updateData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating contribution ${id}:`, error);
    throw error;
  }
} 
};

// Helper functions
const normalizeContribution = (data: any): IContribution => ({
  id: data.id,
  name: data.name,
  doc_url: data.doc_url,
  image_url: data.images?.map(normalizeImage) || [],
  closure_date_id: data.closure_date_id,
  user_id: data.user_id,
  created_at: data.created_at,
  is_selected_for_publication: data.is_selected_for_publication,
  version: data.version,
  created_by: data.created_by,
  updated_by: data.updated_by,
  updated_at: data.updated_at,
  votes: data.user_votes?.map((vote: any) => ({
    id: vote.id,  
    type: vote.pivot.type,
    userid: vote.pivot.user_id,
    username: vote.name,  
    contribution_id: vote.contribution_id,
    created_at: vote.created_at,   
    updated_at: vote.updated_at
  })) || [],
  comments: data.user_comments?.map((comment: any) => ({
   
    comment_id: comment.id,
    content: comment.pivot.content,
    user_id: comment.id,
    user: {
      id: comment.id,  
      name: comment.name,
      role: comment.role
    },
    contribution_id: comment.pivot.contribution_id,
    created_at: comment.pivot.created_at,
    updated_at: comment.pivot.updated_at
  })) || [],
  user: {
    id: data.user.id,
    name: data.user.name,
    faculty: {
      id: data.user.faculty.id,
      name: data.user.faculty.name,
      image_url: data.user.faculty.image_url,
      description: data.user.faculty.description
    },
    faculty_id: data.user.faculty_id,
    role: data.user.role,
    roles: data.user.roles?.map(normalizeRole) || []
  }
});

const normalizeImage = (img: any) => ({
  id: img.id,
  image_url: img.image_url,
  created_at: img.created_at,
  updated_at: img.updated_at
});

const normalizeRole = (role: any) => ({
  id: role.id,
  name: role.name,
  pivot: {
    model_type: role.pivot.model_type,
    model_id: role.pivot.model_id,
    role_id: role.pivot.role_id
  }
});

const handleServiceError = (message: string, error: unknown) => {
  console.error(message, error instanceof Error ? error.message : error);
};