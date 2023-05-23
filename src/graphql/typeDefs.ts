import { gql } from '@apollo/client';

/**
 * Global application state
 * that we want available to
 * query via GraphQL.
 */
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    appIsWorking: Boolean!
    miscellaneous: Miscellaneous!
    userSettings: UserSettings!
  }

  type Miscellaneous {
    languages: [Language!]!
    currencies: [Currency!]!
    paymentFrequencies: [PaymentFrequency!]!
  }

  type Language {
    id: String!
    value: String!
    symbol: String!
    text: String!
  }

  type Currency {
    id: String!
    value: String!
    text: String!
    symbol: String!
  }

  type PaymentFrequency {
    id: String!
    value: String!
    text: String!
  }

  type UserSettings {
    language: String!
    currency: String!
    email: String!
    useLoginEmail: String!
  }
`;
