export interface IEcommerceInfoType {
  units: number;
  slug: string;
  sold?: number;
  shipping?: string;
  // images: [{createdDate: { ...StringTypeDef },  pic:{ ...StringTypeDef }}],
  images?: string[];
  description?: string;
  listingType?: string;
  infoSections: {
    title: string;
    body: string;
    ordinal: number;
  }[];
  avgRating?: number;
  ratings?: number;
  discount?: number;

  isFeatured?: boolean;
  isOnPromotion?: boolean;
  buyInfo?: {
    text: string;
    color: string;
  }[];

  hashTags?: string[];
  featureNotes?: {
    text: string;
    color: string;
  }[];

  policies?: string[];
  badges?: {
    label: string;
    color: string;
  }[];

  variations?: {
    name: string;
    displayText: string;
    default: string;
    options: {
      label: string;
      color: string;
      priceAdjustment: number;
      units: number;
      isVisible: boolean;
    }[];

    ref: string;
  }[];
}

export interface AssetType {
  id: string;
  title: string;
  price: number;
  listingType: string;
  shopId: string;
  isVisible: boolean;
  isAvailable: boolean;
  serviceId: string;
  category?: string;
  categoryId?: string;
  subCategory?: string;
  description?: string;
  pic?: {
    createdDate: string;
    pic: {
      image?: string;
      name?: string;
    };
  };
  avgWaitTime?: number;
  showPrice?: boolean;
  showDetails?: boolean;
  ecommerceInfo?: IEcommerceInfoType;
}

export type AssetTypeExtended = AssetType &
  Partial<IEcommerceInfoType> & { reviewCount: number; promotionPrice: number };

export type AssetTypeSummary = Pick<AssetTypeExtended, 'id' | 'title' | 'price' | 'category' | 'serviceId'>;
