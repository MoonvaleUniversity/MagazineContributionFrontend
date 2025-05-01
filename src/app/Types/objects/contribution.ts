// types/contribution.ts

export interface PaginatedContributions {
  data: IContribution[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}
export type ApiContributionResponse = {
  id: string;
  name: string;
  doc_url: string;
  images: string;
  closure_date_id: string;
  user_id: string;
  created_by: string;
}


// types/contribution.ts
export interface IContributionImage {
  id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface IFaculty {
  id: number;
  name: string;
  image_url: string | null;
  description: string | null;
}

export interface IUserRole {
  id: number;
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface IUser {
  id: number;
  name: string;
  faculty: IFaculty;
  roles: IUserRole[];
}

export interface IContribution {
  id: number |string;
  name: string;
  user_id: number |string;
  closure_date_id: number |string;
  doc_url: string;
  is_selected_for_publication: 0 | 1 | 2 ;
  version?: number;
  created_by?: number | null | string;
  updated_by?: number | null;
  created_at: string;
  updated_at?: string;
  image_url: IContributionImage[];
  user: IUser;
}

  export interface ApiContributionResponses {
    success: boolean;
    message: string;
    data: {
      contributions: IContribution;
    };
    errors: unknown[];
    meta: {
      timestamp: string;
      status: number;
    };
  }
// Add to your Types/objects/contribution.ts
export interface IComment {
  id: number;
  content: string;
  user_id: number;
  contribution_id: number;
  created_at: string;
  updated_at: string;
}

export interface IVote {
  id: number;
  type: 'upvote' | 'downvote';
  user_id: number;
  contribution_id: number;
}

export interface IReview {
  id: number;
  rating: number;
  content: string;
  user_id: number;
  contribution_id: number;
}