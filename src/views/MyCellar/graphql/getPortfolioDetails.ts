import { gql } from '@apollo/client';

export const GET_PORTFOLIO_ITEMS = gql`
  query GetPortfolioItems($shopId: String!) {
    getPortfolioItems(shopId: $shopId) {
      isSuccess
      message
      messageType
      result {
        title
        category
        pic {
          createdDate
          pic {
            image
            name
          }
        }
        serviceId
        avgWaitTime
        price
        isVisible
        isAvailable
        showPrice
        showDetails
        shopId
        ecommerceInfo {
          slug
          sold
          shipping
          images
          description
          listingType
          infoSections {
            title
            body
            ordinal
          }
          avgRating
          ratings
          discount
          units
          isFeatured
          isOnPromotion
          buyInfo {
            text
            color
          }
          hashTags
          featureNotes {
            text
            color
          }
          policies
          badges {
            label
            color
          }
          variations {
            id
            name
            options {
              id
              label
              displayText
              color
              priceAdjustment
              units
              isVisible
            }
            default
            displayText
            ref
          }
        }
      }
    }
  }
`;
