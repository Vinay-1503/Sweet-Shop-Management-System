/**
 * Category API Response Types
 * Based on the API response structure from /api/GetCategories
 */

export interface CategoryApiResponse {
  Header: never[];
  EditableColumns: never[];
  ValueChangeColumns: never[];
  TwoFields: never[];
  status: number;
  message: string;
  data: CategoryApiData[];
  TotalRecords: number;
}

export interface CategoryApiData {
  Id: number;
  CategoryName: string;
  Slug: string;
  CategorySubtitle: string;
  CategoryImage: string;
  MetaTitle: string;
  MetaKeywords: string;
  MetaSchemaMarkup: string;
  MetaDescription: string;
  CreatedOn: string;
  UpdatedOn: string | null;
}

/**
 * UI Category Type
 * Transformed from API data for use in components
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  image?: string;
  icon?: string; // For compatibility with existing UI components
}

