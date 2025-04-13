// types/contribution.ts
export interface IContribution {
  id: string;
  name: string;
  doc_url: string;
  image_url: string[];
  closure_date_id: string;
  user_id: string;
  created_by: string;
  created_at: Date;
  is_selected_for_publication?: 0 | 1 | 2; // 0 = pending, 1 = approved, 2 = rejected
  comment?: string;
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