import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { GQLQueryMetaData } from '../../types/DomainTypes';

export enum TabTypes {
  CURRENT = 'current_tab',
  PREVIOUS = 'previous_tab',
}

export interface InvestOffer {
  id: string;
  type: string;
  name: string;
  subtitle: string;
  priceGbp: string;
  unitSize: string;
  expiryDate: string;
  region: string;
  mainImage: string;
}
export interface InvestOfferResult extends GQLQueryMetaData {
  results: InvestOffer[];
}

export interface InvestOfferSection {
  title: string;
  content: string;
}
export interface InvestOfferDetails {
  id: string;
  type: string;
  name: string;
  subtitle: string;
  priceGbp: number;
  unitSize: string;
  expiryDate: string;
  region: string;
  mainImage: string;
  sections: InvestOfferSection[];
  disclaimer: string;
}

export interface UseInvestOffersReturnHookResponse {
  offers: InvestOffer[];
  metaData: Exclude<InvestOfferResult, 'results'>;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (
    variables?:
      | Partial<{
          offerInput: {
            page: number;
            pageSize: number;
            docType: string;
            docStatus: string;
          };
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

export interface InvestNowRequest {
  offerTitle: string;
  offerSubTitle: string;
  offerPrice: number;
  numberOfUnits: number;
  totalPrice: number;
  offerExpiryDate: string;
}
