// types/contribution.ts
export interface IContribution {
  id: string;
  name: string;
  doc_url: string;
  image_url: string[];
  closure_date_id: string;
  user_id: string;
  created_by: string;
}

export type ApiContributionResponse = {
  id: string;
  name: string;
  doc_url: string;
  images: Array<{ image_url: string }>;
  closure_date_id: string;
  user_id: string;
  created_by: string;
}