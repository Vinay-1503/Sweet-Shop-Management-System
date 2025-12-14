/**
 * Product API Response Types
 */

export interface ProductApiResponse {
  Header: any[];
  EditableColumns: any[];
  ValueChangeColumns: any[];
  TwoFields: any[];
  status: number;
  message: string;
  data: ProductApiData;
  TotalRecords: number;
}

export interface ProductApiData {
  CurrentPage: number;
  PageSize: number;
  TotalRecords: number;
  TotalPages: number;
  Products: ProductApiItem[];
}

export interface ProductApiItem {
  ProductID: string;
  ProductName: string;
  Slug: string;
  Seller: string;
  Tags: string[];
  Description: string;
  Tax: string;
  SGST_Per: string;
  CGST_Per: string;
  IGST_Per: string;
  CESS_Per: string;
  Brands: string;
  Rate: string;
  CostPrice: string;
  DiscountedPrice: string;
  CollectionID: string;
  Units: string;
  Category: string;
  Barcode: string;
  AvailableStock: string;
  MainImage: string;
  OtherImages: ProductImage[];
  Manufacturer: string;
  FSSAI_License_No: string;
  MaxReturnDays: string;
  IsCODAllowed: string;
  TotalAllowedQuantity: string;
  ProductType: string;
  MadeIn: string;
  IsCancelable: string;
  IsReturnable: string;
  ProductStatus: string;
  AddedBy: string;
  Meta: ProductMeta;
  ProductVariants: ProductVariant[];
}

export interface ProductImage {
  ImageID: string;
  ImageURL: string;
}

export interface ProductMeta {
  Title: string;
  Keywords: string[];
  SchemaMarkup: string;
  Description: string;
}

export interface ProductVariant {
  VariantID: string;
  VariantName: string;
  Measurement: string;
  Price: string;
  DiscountedPrice: string;
  Stock?: string; // Legacy field - DO NOT USE, use AvailableStock instead
  AvailableStock?: string; // Primary stock field - ALWAYS USE THIS
  availableStock?: string; // Alternative format
  available_stock?: string; // Alternative format
  Unit: string;
  Status: string;
  OtherImages?: string[] | Array<{ImageID?: string; ImageURL?: string; ImageUrl?: string; url?: string}>; // Variant images array (API uses OtherImages for variants)
  VariantImages?: string[]; // Legacy support - API actually uses OtherImages
}

/**
 * GetProductsByCategoryId API Response Types
 */
export interface ProductsByCategoryApiResponse {
  Header: never[];
  EditableColumns: never[];
  ValueChangeColumns: never[];
  TwoFields: never[];
  status: number;
  message: string;
  data: ProductsByCategoryApiItem[];
  TotalRecords: number;
}

export interface ProductsByCategoryApiItem {
  ProductID: string;
  ProductName: string;
  Rate: string;
  CostPrice: string;
  DiscountedPrice: string;
  AvailableStock: string;
  MainImage: string;
}

/**
 * GetProductDetails API Response Types
 */
export interface ProductDetailsApiResponse {
  Header: never[];
  EditableColumns: never[];
  ValueChangeColumns: never[];
  TwoFields: never[];
  status: number; // 0 means success for this API
  message: string;
  data: ProductDetailsData;
  TotalRecords: number;
}

export interface ProductDetailsData {
  ProductID: string;
  ProductName: string;
  Slug: string;
  Description: string;
  Brands: string;
  Rate: string;
  CostPrice: string;
  DiscountedPrice: string;
  AvailableStock: string;
  Units: string;
  MainImage: string;
  Manufacturer: string;
  MadeIn: string;
  ProductType: string;
  IsCODAllowed: string;
  IsCancelable: string;
  IsReturnable: string;
  ProductStatus: string;
  Meta: {
    Title: string;
    Keywords: string;
    Description: string;
    SchemaMarkup: string;
  };
  Category: string;
  OtherImages: string[]; // Array of image URLs
  Variants: ProductVariant[];
}