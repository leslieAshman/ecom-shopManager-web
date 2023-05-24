import { MiscellaneousAction, MiscellaneousEventTypes, MiscellaneousType } from '../types/AppType';

export const miscellaneousReducer = (state: MiscellaneousType, action: MiscellaneousAction) => {
  switch (action.type) {
    case MiscellaneousEventTypes.UPDATE_MISC:
      return {
        ...state,
        ...(action.payload || {}),
      };
    default:
      return state;
  }
};
