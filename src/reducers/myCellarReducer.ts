import { ProductActions, ProductType, Types } from '../types/productType';

export const myCellarReducer = (state: ProductType[], action: ProductActions) => {
  switch (action.type) {
    case Types.Add:
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
        },
      ];
    case Types.Delete:
      return [...state.filter((product) => product.id !== action.payload.id)];
    default:
      return state;
  }
};
