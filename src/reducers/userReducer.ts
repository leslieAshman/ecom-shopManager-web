import { BaseUser, UserAction, UserEventTypes } from 'types/UserType';

export const userReducer = (state: BaseUser, action: UserAction) => {
  switch (action.type) {
    case UserEventTypes.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
