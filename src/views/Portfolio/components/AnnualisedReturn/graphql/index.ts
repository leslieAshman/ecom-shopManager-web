import { gql } from '@apollo/client';

export const PORTFOLIO_ANNUALISED_RETURN = gql`
  query PortalPortfolioAnnualisedReturn($portfolioId: Int) {
    portalPortfolioAnnualisedReturn(portfolioId: $portfolioId) {
      years {
        date
        value
      }
      monthly {
        date
        value
      }
    }
  }
`;
