export interface EventAndExperienceType {
  id: string;
  title: string;
  price: number;
  dateTime: string;
  time: string;
  priceCurrency: string;
  type: string;
  locationShort: string;
  country?: string;
  mainImage?: string;
  locationFullAddress?: string;
  content?: string;
  eventbriteId?: string;
  eventbriteShow?: boolean;
}

export interface LearningHubType {
  id: string;
  title: string;
  contentType: string;
  publishDate: string;
  contentShort: string;
  contentLong?: string;
  mainImage: string;
  videoUrl?: string;
}
