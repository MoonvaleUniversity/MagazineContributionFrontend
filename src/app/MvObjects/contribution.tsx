import { IContribution, ApiContributionResponse } from "../Types/objects/contribution";

export class Contribution implements IContribution {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly doc_url: string,
    public readonly image_url: string[],
    public readonly closure_date_id: string,
    public readonly user_id: string,
    public readonly created_by: string
  ) {}

  static fromMap(data: ApiContributionResponse): Contribution {
    return new Contribution(
      data.id,
      data.name,
      data.doc_url,
      data.images.map(img => img.image_url),
      data.closure_date_id,
      data.user_id,
      data.created_by
    );
  }

  toMap(): ApiContributionResponse {
    return {
      id: this.id,
      name: this.name,
      doc_url: this.doc_url,
      images: this.image_url.map(image_url => ({ image_url })),
      closure_date_id: this.closure_date_id,
      user_id: this.user_id,
      created_by: this.created_by
    };
  }
}