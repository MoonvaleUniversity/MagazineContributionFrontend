// types/contribution.ts
export interface IContribution {
  id: string;
  name: string;
  doc_url: string;
  image_url: string[];
  closure_date_id: string;
  user_id: string;
  created_by: string;
  created_at: string;
  is_selected_for_publication: number;
}

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