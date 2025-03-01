export interface Contribution {
    id: string;
    title: string;
    description: string;
    file: string;
    type: 'article' | 'image';
  }