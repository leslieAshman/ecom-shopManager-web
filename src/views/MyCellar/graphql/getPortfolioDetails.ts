import { gql } from '@apollo/client';

export const GET_PORTFOLIO_DETAILS = gql`
  query GetPortfolioDetails($portfolioId: String!) {
    getPortfolioDetails(portfolioId: $portfolioId) {

      
    }
  }
`;
