export interface ICategory {
  categoryRef: string;
  title: string;
  subTitle: string;
  description: string;
  listingsCount: number;
  pic: { createdDate: string; pic: string };
  featuredTitle: string;
  exploreText: string;
  stDate: string;
  duration: number;
  isFeatured: boolean;
  slug: string;
}
