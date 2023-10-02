import { ObjectType } from 'types/commonTypes';
import { MiscellaneousAction, MiscellaneousEventTypes, MiscellaneousType } from '../types/AppType';

export const miscellaneousReducer = (state: MiscellaneousType, action: MiscellaneousAction) => {
  switch (action.type) {
    case MiscellaneousEventTypes.UPDATE_MISC:
      return {
        ...state,
        ...(action.payload || {}),
      };
    case MiscellaneousEventTypes.UPDATE_UTIL:
      const newAreas = {};
      const mCities = [...((action.payload.cities || state.cities || []) as ObjectType[])];
      const areas = [...((action.payload.areas || state.areas || []) as ObjectType[])];

      const dataKeys = {
        ...(state.dataKeys as ObjectType),
        ...(action.payload.dataKeys || {}),
      };

      if (action.payload.city) {
        const mCity = mCities.find((x) => x.id === (action.payload?.city as ObjectType).id);
        if ((action.payload?.city as ObjectType).isNew && !mCity) mCities.push(action.payload?.city as ObjectType);
      }

      if (!!action.payload.area && (action.payload.area as ObjectType).isNew)
        Object.assign(newAreas, { [(action.payload.city as ObjectType).id as string]: [action.payload.area] });

      return {
        ...state,
        cities: mCities,
        areas,
        dataKeys,
        newAreas,
      };
    default:
      return state;
  }
};
