// /types/banner.ts
export interface Banner {
  _id?: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}