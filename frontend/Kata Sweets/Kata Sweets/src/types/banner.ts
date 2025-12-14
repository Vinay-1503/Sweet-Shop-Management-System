/**
 * Banner API Response Types
 */

export interface BannerApiResponse {
  Header: any[];
  EditableColumns: any[];
  ValueChangeColumns: any[];
  TwoFields: any[];
  status: number;
  message: string;
  data: BannerApiData[];
  TotalRecords: number;
}

export interface BannerApiData {
  ID: number;
  BannerStr: string;
  BannerDesc: string;
  CreatedOn: string;
  CollectionID: number;
  ProductCode: number;
  IsReg: boolean;
  SequenceNo: number;
}

/**
 * Transformed Banner Data for UI
 */
export interface Banner {
  id: string;
  image: string;
  title: string;
  description: string;
  badge?: string;
  cta?: string;
  gradient?: { from: string; to: string };
  icon?: React.ReactNode;
  // Navigation properties
  productCode?: number;
  collectionId?: number;
  navigationType: 'product' | 'category' | 'none';
}

