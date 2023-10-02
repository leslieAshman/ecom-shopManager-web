import { User } from '__generated__/graphql';
import { ActionMap } from './commonTypes';
import { PortfolioType } from 'views/Portfolio/types';

export type BaseUser = Partial<User> &
  Partial<{
    portfolios: PortfolioType[];
    _id?: string;
  }>;

export enum UserEventTypes {
  UPDATE_USER = 'update_userState',
}

type UserPayload = {
  [UserEventTypes.UPDATE_USER]: Partial<BaseUser>;
};

export type UserAction = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];
