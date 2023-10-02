// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export interface CurrencyFormater {
  format: (value: number, isNew?: boolean) => string;
}

export type ObjectType = Record<string, unknown>;

export interface BaseResponse<T> {
  isSuccess: boolean;
  message?: string;
  messageType?: string;
  result?: T;
}

export interface GetResponse<T> {
  [Key: string]: BaseResponse<T>;
}
