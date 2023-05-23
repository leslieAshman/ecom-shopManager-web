export type Tokens = {
  refreshToken: string;
  accessToken: string;
  userToken: string;
};

enum LocalStorageKeys {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  USER_TOKEN = 'USER_TOKEN',
}

export function getAccessToken(): string | null {
  return localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
}

export function getUserToken(): string | null {
  return localStorage.getItem(LocalStorageKeys.USER_TOKEN);
}

export function updateAccessToken(token: string): void {
  localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, token);
}

export function updateRefreshToken(token: string): void {
  localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, token);
}

export function updateUserToken(token: string): void {
  localStorage.setItem(LocalStorageKeys.USER_TOKEN, token);
}

export function signOut(): void {
  localStorage.clear();
}

// export const onLogout = () => {
//   signOut();
//   isLoggedInVar(false);
// };
