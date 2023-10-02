import { BaseUser, UserEventTypes } from 'types/UserType';
import { EntityListing, Product } from 'types/productType';
import { PortfolioType, PortfolioAction, PortfolioEventTypes } from '../types';

// export const getKey = (x: EntityListing) =>
//   `${x.shopId}${x._id}${(x.variations || [])
//     .map((z: { name: string; value: number }) => `${z.name}${z.value}`)
//     .join('_')}`;

type PortfolioEntity = PortfolioType & Pick<BaseUser, 'portfolios'>;
export const portfolioReducer = (state: PortfolioEntity, action: PortfolioAction) => {
  switch (action.type) {
    case PortfolioEventTypes.UPDATE_PORTFOLIO:
      return {
        ...state,
        ...action.payload,
      };
    case PortfolioEventTypes.ADD_TO_CART:
      return state;
    // case EntityEventTypes.ADD_TO_CART:
    //   let movedItem = { ...action.model };
    //   const cart = state.shoppingCart || [];
    //   const unlikeItems = cart.filter((x: EntityListing) => getKey(x) !== getKey(movedItem));
    //   const likedItems = cart.filter((x: EntityListing) => getKey(x) === getKey(movedItem));

    //   if (likedItems) {
    //     movedItem = likedItems.reduce((obj: EntityListing, x: EntityListing) => {
    //       obj.quantity = obj.quantity + x.quantity;
    //       return obj;
    //     }, movedItem);
    //     movedItem.price = movedItem.quantity * movedItem.basePrice;
    //   }

    //   return {
    //     ...state,
    //     // shoppingCart: [...unlikeItems, movedItem],
    //   };

    // case 'UPDATE_SEARCH_REGION':
    //   return {
    //     ...prevState,
    //     country: action.country,
    //     area: action.area,
    //     city: action.city,
    //     serviceType: action.serviceType,
    //   };
    // case 'SET_CAMPAIGNS':
    //   const newCampaigns = action.isAdd ? [...(prevState.campaigns || [])] : [];
    //   return {
    //     ...prevState,
    //     campaigns: [...newCampaigns, ...action.campaigns],
    //     campaignCount: action.count > 0 ? action.count : prevState.campaignCount || 0,
    //   };

    // case 'UPDATE_CAMPAIGNS':
    //   let campaigns = [...(prevState.campaigns || [])];
    //   const shared = {
    //     isSaving: !!action.campaign.isSaving && action.campaign.isSaving,
    //     isError: action.isError,
    //     errors: action.errors,
    //   };

    //   let modCampaign = campaigns.find((x) => x._id === action.campaign._id);
    //   if (!modCampaign) {
    //     const { title, startDate } = action.campaign;
    //     const mCampIndex = campaigns.findIndex((x) => x.title === title && x.startDate === startDate);
    //     console.log('REDCUE ACTION', action);
    //     if (mCampIndex > -1) {
    //       modCampaign = {
    //         ...prevState.campaigns[mCampIndex],
    //         ...action.campaign,
    //         ...shared,
    //       };
    //       campaigns = [
    //         ...campaigns.splice(0, mCampIndex),
    //         modCampaign,
    //         ...campaigns.splice(mCampIndex + 1, prevState.campaigns.length),
    //       ];
    //     }
    //   } else {
    //     if (action.isDelete) _.remove(campaigns, (x) => x._id === action.campaign._id);
    //     else Object.assign(modCampaign, action.campaign, shared);
    //   }
    //   console.log('REDUCER CAMPAIGN', modCampaign, campaigns);
    //   return {
    //     ...prevState,
    //     campaigns,
    //   };
    // case 'SHOP_LOGO':
    //   return {
    //     ...prevState,
    //     shop: {
    //       ...(prevState.shop || {}),
    //       logo: action.payload,
    //     },
    //   };

    // case 'UPDATE':
    //   return {
    //     ...prevState,
    //     app: {
    //       ...prevState.app,
    //       ...action.info,
    //     },
    //   };

    // case 'UPDATE_LOADER':
    //   return {
    //     ...prevState,
    //     app: {
    //       ...prevState.app,
    //       loadingConfig: {
    //         ...action.payload,
    //       },
    //     },
    //   };

    // case 'UPDATE_ALERT':
    //   return {
    //     ...prevState,
    //     app: {
    //       ...prevState.app,
    //       alertConfig: {
    //         ...action.payload,
    //       },
    //     },
    //   };

    // case 'LAST_SEARCH':
    //   return {
    //     ...prevState,
    //     lastSearchValue: action.seachValue,
    //   };
    // case 'SET_SELECTED_SHOP':
    //   return {
    //     ...prevState,
    //     selectedShopId: action.shopId,
    //   };
    // case 'UPDATE_BOOKINGS':
    //   const shops = [...prevState.shops];
    //   const shop = shops.find((x) => x._id === action.shopId);
    //   if (shop) shop.bookings = action.bookings;
    //   return {
    //     ...prevState,
    //     shops,
    //   };

    case PortfolioEventTypes.UPDATE_SHOP:
      const index = state?.portfolios?.findIndex((x: PortfolioType) => x._id === action.payload._id) ?? -1;
      if (index > -1) {
        const xShop = { ...state.portfolios?.[index], ...action.payload };
        const shops = [...(state.portfolios ?? [])].filter((shop) => shop._id !== action.payload._id);
        return {
          ...state,
          portfolio: xShop,
          selectedEntityId: xShop._id,
          portfolios: [...shops, { ...xShop }],
        };
      } else {
        return {
          ...state,
          selectedShopId: action.payload._id,
          shops: [...(state.portfolios ?? []), { ...action.payload }],
        };
      }

    // case 'SELECT_STAFF':
    //   return {
    //     ...prevState,
    //     staff: action.staff || {},
    //   };
    // case 'HIDE_BACK_BTN':
    //   return {
    //     ...prevState,
    //     isHideBackBtn: action.isHideBackBtn,
    //   };
    // case 'CREATE_BOOKING':
    //   return {
    //     ...prevState,
    //     booking: action.booking || {},
    //   };

    // case 'UPDATE_STAFF_PIC':
    //   const employees = prevState.shop.employees;
    //   const empIndex = employees.findIndex((emp) => emp.id === action.staffId);

    //   return {
    //     ...prevState,
    //     shop: {
    //       ...prevState.shop,
    //       employees: [
    //         ...employees.slice(0, empIndex),
    //         {
    //           ...employees[empIndex],
    //           pic: action.pic,
    //         },
    //         ...employees.slice(empIndex + 1, employees.length),
    //       ],
    //     },
    //   };

    // case 'UPDATE_QUEUE_SETTINGS':
    //   const staff = prevState.staff;
    //   const qIndex = staff.queues.findIndex((q) => q.id === action.queue.id);
    //   let ques = [...prevState.staff.queues];
    //   if (action.applyToAll) {
    //     ques = ques.map((q) => {
    //       const clonedQ = { ...q };
    //       clonedQ.serviceBin = [];
    //       return clonedQ;
    //     });
    //   } else {
    //     ques = [...staff.queues.slice(0, qIndex), action.queue, ...staff.queues.slice(qIndex + 1, staff.queues.length)];
    //   }

    //   return {
    //     ...prevState,
    //     staff: {
    //       ...prevState.staff,
    //       queues: ques,
    //       serviceBin: action.applyToAll ? [...action.queue.serviceBin] : [...prevState.staff.serviceBin],
    //     },
    //   };

    default:
      //   console.log('UN_HANDLE TYPES MAIN REDUCERS', action.type);
      return;
  }
};
