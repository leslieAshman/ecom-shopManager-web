import { gql } from '__generated__';

export const GET_MISCELLANEOUS = gql(`
  query GetMiscellaneous {
    miscellaneous @client {
      languages {
        id
        value
        symbol
        text
      }
      currencies {
        id
        value
        text
        symbol
      }
      paymentFrequencies {
        id
        value
        text
      }
    }
  }
`);
